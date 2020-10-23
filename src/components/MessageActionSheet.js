import React, {useEffect, useState} from 'react';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';

import {View, StyleProp, Text, StyleSheet} from 'react-native';

import {ChatClientService, SCText} from '../utils';
import {useTheme} from '@react-navigation/native';
import {SVGIcon} from './SVGIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const MessageActionSheet = React.forwardRef((props, actionSheetRef) => {
  const chatClient = ChatClientService.getClient();
  const {colors} = useTheme();
  const options = [
    {
      id: 'cancel',
      title: 'Cancel',
      icon: 'drafts',
      handler: () => null,
    },
  ];

  if (props.message.user.id === chatClient.user.id) {
    options.push({
      id: 'edit',
      title: 'Edit Message',
      icon: 'edit-text',
      handler: props.handleEdit,
    });
    options.push({
      id: 'delete',
      title: 'Delete message',
      icon: 'delete-text',
      handler: props.handleDelete,
    });
  }

  options.push({
    id: 'copy',
    title: 'Copy Text',
    icon: 'copy-text',
    handler: () => null,
  });
  options.push({
    id: 'reply',
    title: 'Reply in Thread',
    icon: 'threads',
    handler: props.openThread,
  });
  const onActionPress = actionId => {
    const action = options.find(o => o.id === actionId);
    action.handler && action.handler();
    props.setActionSheetVisible(false);
  };

  return (
    <ActionSheet
      title={renderReactions(props.supportedReactions, props.handleReaction)}
      cancelButtonIndex={0}
      destructiveButtonIndex={0}
      onPress={index => onActionPress(options[index].id)}
      styles={{
        body: {
          backgroundColor: colors.background,
        },
        buttonBox: {
          alignItems: 'flex-start',
          height: 50,
          marginTop: 1,
          justifyContent: 'center',
          backgroundColor: colors.background,
        },
        cancelButtonBox: {
          height: 50,
          marginTop: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          display: 'none',
        },
        titleBox: {
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          padding: 15,
        },
      }}
      options={options.map((option, i) => {
        return (
          <View
            key={option.title}
            testID={`action-sheet-item-${option.title}`}
            style={{
              flexDirection: 'row',
              paddingLeft: 20,
            }}>
            <SVGIcon height="20" width="20" type={option.icon} />
            <SCText
              style={{
                marginLeft: 20,
                color: option.id === 'delete' ? '#E01E5A' : colors.text,
              }}>
              {option.title}
            </SCText>
          </View>
        );
      })}
      ref={actionSheetRef}
    />
  );
});

export const renderReactions = (supportedReactions, handleReaction) => {
  const emojiDataByType = {};
  supportedReactions.forEach(e => (emojiDataByType[e.id] = e));
  console.warn(supportedReactions);
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        height: 30,
        flex: 1,
        justifyContent: 'center',
      }}>
      {supportedReactions.map((r, index) => (
        <ReactionItem
          key={index}
          type={r.id}
          icon={r.icon}
          handleReaction={handleReaction}
        />
      ))}
    </View>
  );
};

const ReactionItem = ({type, handleReaction, icon}) => {
  const {dark} = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        handleReaction(type);
      }}
      key={type}
      style={[
        styles.reactionItemContainer,
        {
          borderColor: dark ? '#1E1D21' : 'transparent',
          backgroundColor: dark ? '#313538' : '#F8F8F8',
        },
      ]}>
      <Text
        style={[
          styles.reactionItem,
          {
            color: dark ? '#CFD4D2' : '#0064c2',
          },
        ]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
};

MessageActionSheet.displayName = 'messageActionSheet';

const styles = StyleSheet.create({
  reactionListContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
  },
  reactionItemContainer: {
    borderWidth: 1,
    padding: 3,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 40,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionItem: {
    fontSize: 28,
  },
});