/**
* 图片和文字按钮
*/
'use strict';
import React, {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Component,
    PropTypes,
    Image,
} from 'react-native';

const systemButtonOpacity = 0.2;

export default class Button extends Component {
    static propTypes = {
        ...TouchableOpacity.propTypes,
        disabled: PropTypes.bool,
        onPress: PropTypes.func,
        children: PropTypes.string,
        imageSource: PropTypes.number,
        style: View.propTypes.style,
        textStyle: Text.propTypes.style,
        imageStyle: Image.propTypes.style,
        //是否已图片开始
        imageStart: PropTypes.bool,
    };
    static defaultProps = {
        disabled: false,
        imageSource: -1,
        onPress: () => {},
        imageStart: false,
    };
    render() {
        var viewArray = [];
        if(this.props.imageSource != -1) {
            viewArray.push(
                <Image key='image' style={[styles.image, this.props.imageStyle]} source={this.props.imageSource} />
            );
        }
        if(typeof(this.props.children) === 'string' && this.props.children.length > 0) {
            viewArray.push(
                <Text key='text' style={[styles.text, this.props.textStyle]}>
                    {this.props.children}
                </Text>
            );
        }
        if(!this.props.imageStart) {
            viewArray.reverse();
        }
        var touchableProps = {
            activeOpacity: this._computeActiveOpacity(),
        };
        if(!this.props.disabled) {
            touchableProps.onPress = this.props.onPress;
            touchableProps.onPressIn = this.props.onPressIn;
            touchableProps.onPressOut = this.props.onPressOut;
            touchableProps.onLongPress = this.props.onLongPress;
        }
        return (
            <TouchableOpacity {...touchableProps} style={[styles.button, this.props.style]}>
            {viewArray}
            </TouchableOpacity>
        );
    }

    _onPress() {
        this.props.onPress();
    }

    _computeActiveOpacity() {
        if (this.props.disabled) {
            return 1;
        }
        return this.props.activeOpacity != null ?
        this.props.activeOpacity :
        systemButtonOpacity;
    }
};

const styles = StyleSheet.create({
    button: {
        // height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'blue',
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        margin: 5,
    }
});
