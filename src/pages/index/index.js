import Taro, {Component} from "@tarojs/taro";
import {View, Button, Text} from "@tarojs/components";
import {observer, inject} from "@tarojs/mobx";

import "./index.less";


@inject("commonStore")
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: "首页"
  };

  componentWillMount() {
  }

  componentWillReact() {
    console.log("componentWillReact");
  }

  componentDidMount() {
    // console.log("store", this.props.commonStore);
    console.log("wx", wx);
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  increment = () => {
    const {counterStore} = this.props;
    counterStore.increment();
  };

  decrement = () => {
    const {counterStore} = this.props;
    counterStore.decrement();
  };

  incrementAsync = () => {
    const {counterStore} = this.props;
    counterStore.incrementAsync();
  };

  render() {
    const {commonStore: {loadingStatus}} = this.props;
    return (
      <View className='index'>
        <Text>{loadingStatus}</Text>
      </View>
    );
  }
}

export default Index;
