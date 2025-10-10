import React from 'react';
import { colors } from '../../themes/vars';
import { IconOnboarding1 } from '../../common/icons/onboarding1';

export default [
  {
    id: '1',
    title: 'Smart Calling for Smart ',
    title1: 'Businesses',
    subTitle: 'Call, record & Whatsapp in one app',
    subTitle1: null,
    subTitle2: null,
    image: require('../../assets/onboardingimg1.png'),
    color: colors.white,
    colorBtn: colors.slide1Btn,
    iconbiz: <IconOnboarding1 color={colors.slide1Btn} />,
  },
  {
    id: '2',
    title: 'Smart Solutions for Smarter ',
    title1: `Support`,
    subTitle: 'Invite your team to handle customer queries',
    subTitle1: 'anywhere, anytime',
    subTitle2: null,
    image: require('../../assets/onboardingimg2.png'),
    color: colors.white,
    colorBtn: colors.slide2Btn,
    iconbiz: <IconOnboarding1 color={colors.slide2Btn} />,
  },
  {
    id: '3',
    title: 'Empower Your Team to',
    title1: `Support On-the-Go`,
    subTitle: 'Mobile Customer Support for a Mobile ',
    subTitle1: 'World for all incoming & outgoing calls',
    subTitle2: null,
    image: require('../../assets/onboardingimg21.png'),
    color: colors.white,
    colorBtn: colors.slide3Btn,
    iconbiz: <IconOnboarding1 color={colors.slide3Btn} />,
  },
];
