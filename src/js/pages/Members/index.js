
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import classes from './style.css';
import helper from 'utils/helper';
import GroupInfo from '../../wfc/model/groupInfo';
import wfc from '../../wfc/wfc';
import Switch from 'components/Switch';

@inject(stores => ({
    show: stores.members.show,
    close: () => stores.members.toggle(false),
    target: stores.members.target,
    list: stores.members.list,
    search: stores.members.search,
    searching: stores.members.query,
    filtered: stores.members.filtered,
    showUserinfo: async (user) => {
        var caniremove = false;
        if (stores.chat.target instanceof GroupInfo) {
            let groupInfo = stores.chat.target;
            if (groupInfo.owner === wfc.getUserId()) {
                caniremove = true;
            }
        }

        stores.userinfo.toggle(true, stores.chat.conversation, user, caniremove);
    },
    addMember: () => {
        stores.members.toggle(false);
        stores.addmember.toggle(true);
    },
    showGroupMenus: (target) => {
        if (target instanceof GroupInfo) {
          stores.groupMenus.toggle(true, target);
        }
      },
}))
@observer
export default class Members extends Component {
    render() {
        var { target, searching, list, filtered } = this.props;


        if (!this.props.show) {
            return false;
        }

        let targetName = '';
        if (target instanceof GroupInfo) {
            targetName = target.name;
        }

        return (
            <div className={classes.container}>
                <header>
                    <span dangerouslySetInnerHTML={{ __html: `群组 '${targetName}' 拥有 ${list.length} 位成员` }} />

                    <span>
                        <i
                            className="icon-ion-android-add"
                            onClick={e => this.props.addMember()}
                            style={{
                                marginRight: 20,
                            }} />

                        <i
                            className="icon-ion-android-close"
                            onClick={e => this.props.close()} />
                    </span>
                </header>

                <ul className={classes.list}>
                    {
                        (searching && filtered.length === 0) && (
                            <div className={classes.notfound}>
                                <img src="assets/images/crash.png" />
                                <h1>Can't find any people matching '{searching}'</h1>
                            </div>
                        )
                    }

                    {
                        (searching ? filtered : list).map((e, index) => {
                            var pallet = e.pallet || [];
                            var frontColor = pallet[1] || [0, 0, 0];

                            return (
                                <li
                                    key={index}
                                    onClick={ev => this.props.showUserinfo(e)}
                                    style={{
                                        color: `rgb(
                                            ${frontColor[0]},
                                            ${frontColor[1]},
                                            ${frontColor[2]}
                                        )`,
                                    }}>
                                    <div
                                        className={classes.cover}
                                        style={{
                                            backgroundImage: `url(${e.portrait})`,
                                        }} />
                                    <span
                                        className={classes.username}
                                        dangerouslySetInnerHTML={{ __html: e.displayName }} />
                                </li>
                            );
                        })
                    }
                </ul>

                <hr />

                <div className={classes.column}>
                    <ul >
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>群聊名称
                                    <input type="text" className={classes.groupName} placeholder="群名称"/>
                                </span>
                                <button className="Switch">保存</button>
                            </label>
                        </li>

                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>更改头像</span>
                                <input type="file" />
                                <button className="Switch">上传</button>
                                <button className="Switch">保存</button>
                            </label>
                        </li>

                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>群管理</span>
                                <button className="Switch" onClick={e => this.props.showGroupMenus(target)}>
                                    更多
                                </button>
                            </label>
                        </li>
                        <hr />
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>查找聊天内容</span>
                                <button className="Switch">搜索</button>
                            </label>
                        </li>
                        <hr />
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>消息免打扰</span>
                                <Switch id="alwaysOnTop" />
                            </label>
                        </li>
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>置顶聊天</span>
                                <Switch id="alwaysOnTop" />
                            </label>
                        </li>
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>保存到通讯录</span>
                                <Switch id="alwaysOnTop" />
                            </label>
                        </li>
                        <hr />
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>我的本群昵称
                                    <input type="text" placeholder="未设置" className={classes.groupName} />
                                </span>
                                <button className="Switch">保存</button>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>显示群成员昵称</span>
                                <Switch id="alwaysOnTop" />
                            </label>
                        </li>
                    </ul>
                </div>

                <div className={classes.footer}>
                    <input
                        autoFocus={true}
                        id="messageInput"
                        maxLength={30}
                        onInput={e => this.props.search(e.target.value)}
                        placeholder="输入内容开始搜索 ..."
                        ref="input"
                        type="text" />
                </div>
            </div>
        );
    }
}
