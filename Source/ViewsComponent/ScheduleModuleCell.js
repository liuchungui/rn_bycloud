/**
 * 待办事项模块的cell
 */
'use strict';
import React, {
    View,
    Text,
    StyleSheet,
    Component,
    TouchableHighlight,
} from 'react-native';

import Device from '../common/Device';
import GlobalColor from '../common/GlobalColor';

export default class ScheduleModuleCell extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var color = 'red';
        var tag = "进行中";
        if(this.props.data.status == 2) {
            tag = "完成";
            color = '#00ff00';
        }
        return (
            <TouchableHighlight underlayColor={GlobalColor.underlayColor} onPress={this.props.onPress}>
                <View style={styles.container}>
                    <View style={[styles.tagContainer, {borderColor: color}]}>
                        <Text style={[styles.tag, {color: color}]}>{tag}</Text>
                    </View>
                    <View style={styles.innerContaniner}>
                        <Text style={styles.content}>{this.props.data.moduleName}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: GlobalColor.lineColor,
        width: Device.scrrenWidth/2.0,
        height: 80,
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    innerContaniner: {
        width: Device.scrrenWidth/2.0,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        color: GlobalColor.mainColor,
        fontSize: 16,
        textAlign: 'center',
    },
    tagContainer: {
        borderRadius: 2.0,
        borderWidth: 1.0,
        borderColor: GlobalColor.lineColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 45,
        marginTop: 5,
        marginRight: 10,
    },
    tag: {
        fontSize: 12,
        textAlign:'center',
    },

});
