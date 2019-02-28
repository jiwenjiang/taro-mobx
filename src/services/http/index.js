/**
 * Created by j_bleach on 2019/2/28 0028.
 */
export const baseUrl = "https://mhdss.tangzhengxiong.com/dc-backend";

const http = (params = {}) => {
  const {url, method = "GET", data, header = {}, success, fail, complete} = params;
  // 登陆不带sessionKey
  let sessionKey = wx.getStorageSync("sessionKey");
  if (url !== "/wx/login") {
    // 检查 session_key 是否过期
    header.sessionKey = sessionKey;
    wx.checkSession({
      // session_key 有效(未过期)
      success: () => {
        // 业务逻辑处理
        wx.request({
          url, // 仅为示例，并非真实的接口地址
          data,
          method,
          header: {
            "content-type": "application/json", // 默认值
            ...header
          },
          success(res) {
            // 检查错误码
            // 3: 没有登陆
            if (res.data.errcode === 3) {
              login(params);
              return;
            }
            success && success(res.data.data);
          },
          fail(err) {
            fail(err);
            throw err;
          },
          complete(res) {
            complete && complete(res);
          }
        });
      },
      // session_key 过期
      fail: function () {
        // session_key过期，重新登录
        login(params);
      }
    });
  } else {
    // 无skey，作为首次登录
    login(params);
  }
};

export const login = function (requestInfo) {
  // 登陆需要code、iv、encryptedData信息
  // const userInfo = wx.getStorageSync("userInfo");
  wx.login({
    success: wxLoginInfo => {
      if (wxLoginInfo.code) {
        wx.getSetting({
          success: res => {
            if (!res.authSetting["scope.userInfo"]) {
              wx.navigateTo({
                url: `../../pages/home/auth`
              });
            } else {
              wx.getUserInfo({
                success: userInfo => {
                  wx.setStorageSync("userInfo", userInfo);
                  wx.request({
                    url: baseUrl + "/wx/login",
                    method: "POST",
                    data: {
                      code: wxLoginInfo.code,
                      encryptedData: userInfo.encryptedData,
                      iv: userInfo.iv
                    },
                    header: {
                      "content-type": "application/json;charset=UTF-8;" // 默认值
                    },
                    success: response => {
                      if (response.data.data) {
                        wx.setStorageSync("sessionKey", response.data.data.sessionKey);
                        // 如果有请求信息就发起请求
                        if (requestInfo) {
                          http(requestInfo);
                        }
                      } else {
                        console.log("登录失败！");
                      }
                    },
                    fail: err => {
                      console.error("登录出错", err);
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

export default http;
