// src/components/RichTextEditor.js
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Text
} from 'react-native';
import { rf, rh, rw } from '../helpers/dimentions';
import BoldSvgIcon from '../icons/BoldSvgIcon';
import ItalicSvgIcon from '../icons/ItalicSvgIcon';
import StrikethroughSvgIcon from '../icons/StrikeThroughSvgIcon';
import { colors } from '../../themes/vars';
import CodeSvgIcon from '../icons/CodeSvgIcon';
import PropTypes from 'prop-types';

const MAX_LENGTH=1024

const RichTextEditor= forwardRef(({
  value,
  onChangeText,
  onProcessedText,
  placeholder = 'Body',
  containerStyle= {},
  toolbarStyle={},
  textInputStyle={},
  cursorTrigger=0
}, ref)=> {
  // selection is fully controlled
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef = useRef(null);
  const [error, setError]=useState("")

  // whenever `value` changes externally, clamp selection
//   useEffect(() => {
//     const len = value?.length || 0;
//     setSelection(({ start, end }) => ({
//       start: Math.min(start, len),
//       end:   Math.min(end, len),
//     }));
//   }, [value]);
useEffect(() => {
    const len = (value || '').length;
    // only adjust if our selection is now out of bounds
    if (selection.start > len || selection.end > len) {
      setSelection({
        start: Math.min(selection.start, len),
        end:   Math.min(selection.end,   len),
      });
    }

    // validation
    if (len > MAX_LENGTH) {
      setError(`Maximum length of ${MAX_LENGTH} characters exceeded`);
    } else {
      setError('');
    }
  }, [value]);


  useEffect(() => {
        // …nothing here before…
        // Only when our parent says “bump”, and if we’re already focused:
        if (inputRef.current?.isFocused()) {
          const len = (value || '').length;
          const pos = { start: len, end: len };
          inputRef.current.setNativeProps({ selection: pos });
          setSelection(pos);
        }
       }, [cursorTrigger]);
  
   // helper to emit processed text
   const emitProcessed = (text) => {
    if (onProcessedText) {
      onProcessedText(text.replace(/\n/g, '\\n'));
    }
  };

  function wrapSelection(marker) {
    const { start, end } = selection;
    const text = value || '';
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);

    let newText, cursorPos;
    if (start === end) {
      // insert empty markers, place cursor between them
      newText = `${before}${marker}${marker}${after}`;
      cursorPos = start + marker.length;
    } else {
      // wrap existing selection
      newText = `${before}${marker}${selected}${marker}${after}`;
      cursorPos = end + marker.length * 2;
    }

    
       // enforce max length
       if (newText.length <= MAX_LENGTH) {
        // emit new text
        onChangeText(newText);
        // update selection to sit just after insertion
        setSelection({ start: cursorPos, end: cursorPos });
         // focus back
        inputRef.current?.focus();
      }
  }


    // Expose insertPlaceholder(label) to parent via ref:
  useImperativeHandle(ref, () => ({
    
    insertPlaceholder: (label) => {
      const { start, end } = selection;
      const text = value || '';
      const before = text.slice(0, start);
      const after = text.slice(end);
      const placeholder = `{{${label}}}`;
      const newText = before + placeholder + after;

      if (newText.length <= MAX_LENGTH) {
        // 1) Update the text
        onChangeText(newText);
       
        // 2) After rendering, move caret to end of inserted placeholder
        const cursorPos = start + placeholder.length;
        // update selection to sit just after insertion
        setSelection({ start: cursorPos, end: cursorPos });
         // focus back
        // inputRef.current?.focus();
        // setTimeout(() => {
        //   inputRef.current?.setNativeProps({
        //     selection: { start: cursorPos, end: cursorPos },
        //   });
        //   setSelection({ start: cursorPos, end: cursorPos });
        //   inputRef.current?.focus();
        // }, 0);
      }
    },
    focus() {
    inputRef.current?.focus();
  }
  }));



   // handle direct typing
   const handleChange = (text) => {
    if (text.length <= MAX_LENGTH) {
      onChangeText(text);
    }
  };

   // When the user taps into the TextInput, move cursor to end
  const handleFocus = () => {
    const len = (value || '').length;
    inputRef.current?.setNativeProps({
      selection: { start: len, end: len }
    });
    setSelection({ start: len, end: len });
  };

  return (
    <View style={[styles.container, containerStyle]}>

      {/* Toolbar */}
      <View style={[styles.toolbar, toolbarStyle]}>

        <TouchableOpacity onPress={() => wrapSelection(`*`)} style={styles.toolButton}>
          {/* <Text style={styles.toolText}>B</Text> */}
          <BoldSvgIcon/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => wrapSelection('_')} style={styles.toolButton}>
          {/* <Text style={styles.toolText}>I</Text> */}
          <ItalicSvgIcon/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => wrapSelection(`~`)} style={styles.toolButton}>
          {/* <Text style={styles.toolText}>S</Text> */}
          <StrikethroughSvgIcon/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => wrapSelection('```')} style={styles.toolButton}>
          {/* <Text style={styles.toolText}>{"</>"}</Text> */}
          <CodeSvgIcon/>
        </TouchableOpacity>
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        selection={selection}
        onSelectionChange={({ nativeEvent }) => {
          setSelection(nativeEvent.selection);
        }}
        multiline
        placeholder={placeholder}
        textAlignVertical="top"
        style={[styles.input, textInputStyle]}
        // onFocus={handleFocus}
        placeholderTextColor={colors.WhatsappTemplateInputBorderColor}
        maxLength={MAX_LENGTH}
      />

       {/* Character count & error */}
       <View style={styles.counterContainer}>
        <Text style={[styles.counterText, error ? styles.errorText : null]}>  
          {`${(value || '').length} / ${MAX_LENGTH}`}
        </Text>
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

     
    
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.6,
    borderColor: colors.WhatsappTemplateEditorBorderColor,
    borderRadius: rw(3),
    overflow: 'hidden',
    marginTop: rh(1),
    marginBottom: rw(4),
  },
  input: {
    minHeight: rw(48),
    padding: rw(3),
    fontSize: rf(1.8),
    fontWeight: '400',
    color: colors.WhatsappTemplateInputBorderColor
  },
  toolbar: {
    flexDirection: 'row',
    borderBottomWidth: 1.2,
    borderColor: '#EEE',
    backgroundColor: '#F2F4F7',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: rw(1),
    paddingHorizontal: rw(2),
  },
  toolButton: {
    padding: rw(1),
  },
  toolText: {
    fontSize: rw(4),
    color: '#667085',
    fontWeight: 'bold'
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(3),
    alignSelf: 'flex-end',
    paddingVertical: rh(1.5)
  },
  counterText: {
    fontSize: rf(1.6),
    color: colors.WhatsappTemplateEditorBorderColor,
    fontWeight: '400'
  },
  errorText: {
    color: colors.error,
  },
  errorMessage: {
    fontSize: rf(1.6),
    color: colors.error,
    paddingHorizontal: rw(3),
    marginTop: rh(0.5),
  }
});

RichTextEditor.proptypes={
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onProcessedText: PropTypes.func,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  toolbarStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  cursorTrigger: PropTypes.number
}

export default RichTextEditor