/**
 * Created by j_bleach on 2019/2/28 0028.
 */

import {observable, action, configure} from "mobx";

configure({
  enforceActions: "observed"
});

class CommonStore {
  @observable loadingStatus; // loading 状态显示


  constructor() {
    this.loadingStatus = 2333;
  }

  // 等待动画
  @action
  changeLoadingStatus(status) {
    this.loadingStatus = status;
  }

}

const commonStore = new CommonStore();

export {commonStore};
