/**
 * 编辑用户的个性签名
 * @author keyy/1501718947@qq.com 16/12/5 15:33
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import * as UserProfileActions from '../actions/UserProfile'
import * as HomeActions from '../actions/Home'
import {toastShort} from '../utils/ToastUtil'
import * as Storage from '../utils/Storage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
    padding: 10
  },
  signatureContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: 150,
    backgroundColor: '#FFF',
    textAlign: 'left',
    textAlignVertical: 'top'
  },
  saveBtn: {
    marginTop: 20,
    height: 40,
    alignItems: 'center'
  }
});

class EditPersonalSignature extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };
  }

  getNavigationBarProps() {
    return {
      title: '编辑签名'
    };
  }

  //保存签名
  _saveSignature(data) {
    const {dispatch, navigator}=this.props;
    dispatch(UserProfileActions.savePersonalSignature({personSignal: data}, (result)=> {
      dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
        Storage.setItem('userInfo', json.Result);
        toastShort('保存成功');
        this.saveSignatureTimer = setTimeout(()=> {
          navigator.pop();
          this.state.callBack();
        }, 2000)
      }, (error)=> {
      }));
    }, (error)=> {
    }));
  }

  componentWillUnmount() {
    if (this.saveSignatureTimer) {
      clearTimeout(this.saveSignatureTimer);
    }
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder={'请在此编辑你的签名'}
          multiline={true}
          maxLength={25}
          style={styles.signatureContent}
          value={this.state.personalSignature}
          underlineColorAndroid={'transparent'}
          onChangeText={(personalSignature)=> {
            this.setState({personalSignature})
          }}
        />
        <NBButton
          block
          style={styles.saveBtn}
          onPress={()=>this._saveSignature(this.state.personalSignature)}
          disabled={!this.state.personalSignature}>
          完成
        </NBButton>
      </View>
    )
  }

}

export default connect((state)=> {
  return {
    ...state
  }
})(EditPersonalSignature)