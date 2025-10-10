import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { colors } from '../../../themes/vars';
import PlusIconSvg from '../../../common/icons/PlusIconSvg';
import CustomHeader from '../../../common/components/CustomHeader';
import { useDispatch, useSelector } from 'react-redux';
import { resetWizard } from '../../../common/redux/actions/templateWizardWhatsapp';
import { WATempLabel, whatsappTemplatesSubtitle } from '../../../common/Constants';
import EyeIconSvg from '../../../common/icons/EyeIconSvg';
import CheckIconSvgWaTemp from '../../../common/icons/CheckIconSvgWaTemp';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import { getWhatsappTemplatesList, sendTemplate } from '../../../common/redux/actions/whatsappEmbedSignup';
import TemplateWizardFooterButton from '../../../common/components/TemplateWizardFooterButton';
import { toastShow } from '../../../common/helpers/utils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SendIconSvg from '../../../common/icons/SendIconSvg';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import ModalMid from '../../../common/components/ModalMid';

// Constants
const SKELETON_COUNT = 6;

// Custom Hooks
const useTemplateData = () => {
    const { user } = useSelector((state) => state?.global);
    const { 
        whatsappAccessToken, 
        isLoading, 
        whatsappTemplatesList, 
        isTemplatesListLoading,
        totalPages
    } = useSelector((state) => state?.whatsappEmbedSingnup);

    const isAdmin = useMemo(() => user?.user_role === '1', [user?.user_role]);
    const templateList = useMemo(() => whatsappTemplatesList || [], [whatsappTemplatesList]);

    return {
        user,
        whatsappAccessToken,
        isLoading,
        isTemplatesListLoading,
        isAdmin,
        templateList,
        totalPages
    };
};

// Skeleton Component
const SkeletonList = React.memo(() => (
    <View style={styles.skeletonContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonLoaderComponent key={`skeleton-${index}`} />
        ))}
    </View>
));

// Empty State Component
const EmptyState = React.memo(({ isAdmin, onCreateTemplate }) => (
    <View style={styles.loadingContainer}>
        <Text style={styles.subTitle}>
            {isAdmin 
                ? 'Your template list is empty, create your first template by clicking that button.'
                : 'Your template list is empty, Your admin not yet created any template until now.'
            }
        </Text>
        {isAdmin && (
            <TemplateWizardFooterButton 
                nextLabel='Create Template' 
                onNext={onCreateTemplate}
                containerStyle={{width: '80%'}}
            />
        )}
    </View>
));

// Status Configuration
const STATUS_CONFIG = {
    APPROVED: {
        color: "#08B632",
        text: "This is approved!",
        backgroundColor: "#F0F8F0"
    },
    PENDING: {
        color: "orange",
        text: "Yet to be approved!",
        backgroundColor: "#FFF8E1"
    },
    REJECTED: {
        color: "#EC344A",
        text: "Rejected",
        backgroundColor: "#FFEBEE"
    }
};

// Helper function to get status config
const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
};

// Template Card Component
const TemplateCard = React.memo(({ item, isAdmin, onSendTemplate, onViewTemplate }) => {
    const statusConfig = getStatusConfig(item.status);
    
    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.category}</Text>
                </View>
                <View style={styles.iconRow}>
                    {!isAdmin && item.status === "APPROVED" && (
                        <TouchableOpacity onPress={() => onSendTemplate(item)}>
                            <SendIconSvg />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={styles.viewIcon}
                    >
                        <EyeIconSvg width={rw(7)} height={rw(7)} onIconPress={() => onViewTemplate(item)}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.footer, { backgroundColor: statusConfig.backgroundColor }]}>
                <CheckIconSvgWaTemp 
                    color={statusConfig.color}
                    width={rw(4)} 
                    height={rw(4)} 
                />
                <Text style={[styles.footerText, { color: statusConfig.color }]}>
                    {statusConfig.text}
                </Text>
            </View>
        </View>
    );
});

// Summary Component
const TemplateSummary = React.memo(({ currentCount, currentPage, totalPages }) => (
    <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
            Showing {currentCount} templates (Page {currentPage} of {totalPages || '...'})
        </Text>
    </View>
));

// Send Template Modal Component
const SendTemplateModal = React.memo(({ 
    visible, 
    onClose, 
    onSend, 
    isLoading, 
    mobileNumber, 
    onMobileNumberChange 
}) => (
    <ModalMid
        title={'Send Template'}
        open={visible}
        onClose={onClose}
    >
        <View>
            <TextInputWithIcon
                placeholder="Enter mobile number"
                value={mobileNumber}
                inputMode="number-pad"
                onChangeText={onMobileNumberChange}
            />
            <TemplateWizardFooterButton 
                nextLabel={isLoading ? 'Sending....' : 'Send Template'} 
                onNext={onSend}
                disableNext={isLoading || !mobileNumber.trim()}
            />
        </View>
    </ModalMid>
));

// Footer Loader Component
const FooterLoader = React.memo(({ hasMoreTemplates, loadingMore }) => {
    if (!hasMoreTemplates) return null;
    
    return (
        <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.footerLoaderText}>
                {loadingMore ? 'Loading more templates...' : 'Pull to load more'}
            </Text>
        </View>
    );
});

export default function WhatsappTemplateScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    // Custom hook for data
    const { 
        user, 
        whatsappAccessToken, 
        isLoading, 
        isTemplatesListLoading, 
        isAdmin, 
        templateList, 
        totalPages
    } = useTemplateData();

    // Local state
    const [refreshing, setRefreshing] = useState(false);
    const [sendModal, setSendModal] = useState(false);
    const [sendMobileNumber, setSendMobileNumber] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Computed values
    const showSkeleton = isTemplatesListLoading && !refreshing;
    const showEmptyState = !isTemplatesListLoading && templateList.length === 0;
    const showFab = isAdmin && templateList.length !== 0;

    // API Functions
    const getTemplateList = useCallback(async (page = 1, isLoadMore = false) => {
        try {
            const data = await dispatch(getWhatsappTemplatesList(whatsappAccessToken, page, isLoadMore));
            
            if (data === 'token expire') {
                toastShow('Session is expired, Please login');
                handleGoToSignup();
            }
            return data;
        } catch (error) {
            console.error('Error fetching templates:', error);
            toastShow('Failed to load templates');
            return null;
        }
    }, [dispatch, whatsappAccessToken, handleGoToSignup]);

    const loadMoreTemplates = useCallback(async () => {
        const hasMoreTemplates = currentPage < totalPages;
        if (!hasMoreTemplates || isTemplatesListLoading || loadingMore) return;
        
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            await getTemplateList(nextPage, true);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error('Error loading more templates:', error);
            toastShow('Failed to load more templates');
        } finally {
            setLoadingMore(false);
        }
    }, [currentPage, totalPages, isTemplatesListLoading, loadingMore, getTemplateList]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            setCurrentPage(1);
            await getTemplateList(1, false);
        } finally {
            setRefreshing(false);
        }
    }, [getTemplateList]);

    // Navigation Functions
    const gotToCreateTemplate = useCallback(async () => {
        navigation.navigate("WhatsappTemplateWizard");
    }, [dispatch, navigation]);

    const handleGoToSignup = useCallback(() => {
        navigation.navigate(isAdmin ? 'WhatsappSignupAdmin' : 'WhatsappSignupAgent');
    }, [navigation, isAdmin]);

    const handleViewTemplate = useCallback((item) => {
        navigation.navigate('Preview', { template: item });
    }, [navigation]);

    // Modal Functions
    const openSendModal = useCallback((template) => {
        setSendModal(true);
        setSelectedTemplate(template);
    }, []);

    const closeSendModal = useCallback(() => {
        setSendModal(false);
        setSelectedTemplate(null);
        setSendMobileNumber('');
    }, []);

    const handleSendTemplate = useCallback(async () => {
        if (!sendMobileNumber.trim()) {
            toastShow('Please enter a mobile number');
            return;
        }

        try {
            const body = {
                to: sendMobileNumber,
                template: {
                    name: selectedTemplate.name,
                    language: {
                        code: selectedTemplate.language
                    }
                }
            };
            
            await dispatch(sendTemplate(body, whatsappAccessToken));
            closeSendModal();
        } catch (error) {
            console.error('Error sending template:', error);
            toastShow('Failed to send template');
        }
    }, [dispatch, sendMobileNumber, selectedTemplate, whatsappAccessToken, closeSendModal]);

    // Effects
    useFocusEffect(
        useCallback(() => {
            // Reset to first page when screen comes into focus
            setCurrentPage(1);
            getTemplateList(1, false);
        }, [getTemplateList])
    );

    // Render Functions
    const renderItem = useCallback(({ item }) => (
        <TemplateCard
            item={item}
            isAdmin={isAdmin}
            onSendTemplate={openSendModal}
            onViewTemplate={handleViewTemplate}
        />
    ), [isAdmin, openSendModal, handleViewTemplate]);

    const renderTemplatesList = useCallback(() => {
        const hasMoreTemplates = currentPage < totalPages;
        
        return (
            <FlatList
                data={templateList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent, 
                    templateList.length === 0 && styles.loadingContainer
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <EmptyState 
                        isAdmin={isAdmin} 
                        onCreateTemplate={gotToCreateTemplate}
                    />
                )}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={handleRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                onEndReached={loadMoreTemplates}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => 
                   loadingMore && hasMoreTemplates && templateList.length > 0 ? (
                        <FooterLoader 
                            hasMoreTemplates={hasMoreTemplates} 
                            loadingMore={loadingMore} 
                        />
                    ) : null
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={6}
            />
        );
    }, [templateList, renderItem, isAdmin, gotToCreateTemplate, refreshing, handleRefresh, loadMoreTemplates, loadingMore, currentPage, totalPages]);

    // Main render
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                hidden={false}
                barStyle="light-content"
                backgroundColor={colors.WhatsapptemplateRedColor}
                translucent
            />
            
            <CustomHeader
                title={WATempLabel}
                containerStyle={styles.headerContainerStyle}
                titleTextStyle={styles.headerTitleTextStyle}
                headerBgColor={colors.WhatsapptemplateRedColor}
                backIconColor={colors.white}
            />

            <View style={styles.innerMainContainer}>
                {isAdmin && (
                    <Text style={styles.subTitle}>{whatsappTemplatesSubtitle}</Text>
                )}

                {/* {!showSkeleton && templateList.length > 0 && (
                    <TemplateSummary 
                        currentCount={templateList.length} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                )} */}

                {showSkeleton && <SkeletonList />}
                {!showSkeleton && renderTemplatesList()}
                
                {showFab && (
                    <TouchableOpacity 
                        style={styles.fab} 
                        onPress={gotToCreateTemplate} 
                        activeOpacity={0.8}
                    >
                        <PlusIconSvg 
                            width={rw(6)} 
                            height={rw(6)} 
                            color="white" 
                            storkeWidth={3} 
                        />
                    </TouchableOpacity>
                )}
            </View>

            <SendTemplateModal
                visible={sendModal}
                onClose={closeSendModal}
                onSend={handleSendTemplate}
                isLoading={isLoading}
                mobileNumber={sendMobileNumber}
                onMobileNumberChange={setSendMobileNumber}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    headerContainerStyle: {
        justifyContent: 'center',
    },
    headerTitleTextStyle: {
        color: colors.white,
        flex: 1,
        alignSelf: 'center',
    },
    innerMainContainer: {
        flex: 1,
        paddingVertical: rh(2),
    },
    subTitle: {
        fontSize: rf(1.8),
        fontWeight: '400',
        color: "#00000061",
        textAlign: 'left',
        marginBottom: rh(1),
        paddingHorizontal: rw(4)
    },
    skeletonContainer: {
        paddingHorizontal: rw(4),
        paddingTop: rh(1),
    },
    listContent: { 
        paddingTop: rh(1), 
        paddingBottom: rh(5), 
        paddingHorizontal: rw(4) 
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: rw(3),
        marginBottom: rh(2),
        overflow: 'hidden',
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: rh(2),
    },
    headerText: { flex: 1 },
    name: { fontSize: rf(2), fontWeight: '600', color: "#181818" },
    role: { fontSize: rf(1.6), color: colors.callGroupIcon, marginTop: rh(0.2) },
    iconRow: { flexDirection: 'row', alignItems: 'center' },
    viewIcon: { marginLeft: rw(4) },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: rh(1.5),
        paddingHorizontal: rw(4),
        borderTopWidth: 0.8,
        borderTopColor: "#E8E6E6"
    },
    footerText: { fontSize: rf(1.5), color: colors.swipe, marginLeft: rw(2) },
    fab: {
        position: 'absolute',
        bottom: rh(4),
        right: rw(4),
        width: rw(14),
        height: rw(14),
        borderRadius: rw(7),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    loadingContainer:{
         flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: rw(2)
    },
    footerLoader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: rh(2),
    },
    footerLoaderText: {
        marginLeft: rw(1),
        color: colors.primary,
        fontSize: rf(1.6),
    },
    summaryContainer: {
        paddingHorizontal: rw(4),
        paddingVertical: rh(1),
        alignItems: 'center',
    },
    summaryText: {
        fontSize: rf(1.4),
        color: "#00000061",
    },
}); 