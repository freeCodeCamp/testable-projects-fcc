'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var project_name = 'drum-machine';
// rawgit dependency: https://rawgit.com/no-stack-dub-sack/fcc-bundled-tests/master/bundleTestWithDrumMachineTest.js

var bankOne = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
}, {
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
}, {
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
}, {
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
}, {
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
}, {
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
}, {
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n'-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
}, {
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
}, {
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
}];

var bankTwo = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Chord-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
}, {
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Chord-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
}, {
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Chord-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
}, {
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Shaker',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
}, {
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
}, {
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
}, {
  keyCode: 90,
  keyTrigger: 'Z',
  id: 'Punchy-Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
}, {
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Side-Stick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
}, {
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Snare',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
}];

var activeStyle = {
  backgroundColor: 'orange',
  boxShadow: "0 3px orange",
  height: 77,
  marginTop: 13
};

var inactiveStyle = {
  backgroundColor: 'grey',
  marginTop: 10,
  boxShadow: "3px 3px 5px black"
};

var DrumPad = function (_React$Component) {
  _inherits(DrumPad, _React$Component);

  function DrumPad(props) {
    _classCallCheck(this, DrumPad);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      padStyle: inactiveStyle
    };
    _this.playSound = _this.playSound.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);
    _this.activatePad = _this.activatePad.bind(_this);
    return _this;
  }

  DrumPad.prototype.componentDidMount = function componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  };

  DrumPad.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  };

  DrumPad.prototype.handleKeyPress = function handleKeyPress(e) {
    if (e.keyCode === this.props.keyCode) {
      this.playSound();
    }
  };

  DrumPad.prototype.activatePad = function activatePad() {
    if (this.props.power) {
      this.state.padStyle.backgroundColor === 'orange' ? this.setState({
        padStyle: inactiveStyle
      }) : this.setState({
        padStyle: activeStyle
      });
    } else {
      this.state.padStyle.marginTop === 13 ? this.setState({
        padStyle: inactiveStyle
      }) : this.setState({
        padStyle: {
          height: 77,
          marginTop: 13,
          backgroundColor: 'grey',
          boxShadow: "0 3px grey"
        }
      });
    }
  };

  DrumPad.prototype.playSound = function playSound(e) {
    var _this2 = this;

    var sound = document.getElementById(this.props.keyTrigger);
    sound.currentTime = 0;
    sound.play();
    this.activatePad();
    setTimeout(function () {
      return _this2.activatePad();
    }, 100);
    this.props.updateDisplay(this.props.clipId.replace(/-/g, ' '));
  };

  DrumPad.prototype.render = function render() {
    return React.createElement(
      'div',
      { id: this.props.clipId,
        onClick: this.playSound,
        className: 'drum-pad',
        style: this.state.padStyle },
      React.createElement('audio', { className: 'clip', id: this.props.keyTrigger, src: this.props.clip }),
      this.props.keyTrigger
    );
  };

  return DrumPad;
}(React.Component);

var PadBank = function (_React$Component2) {
  _inherits(PadBank, _React$Component2);

  function PadBank(props) {
    _classCallCheck(this, PadBank);

    return _possibleConstructorReturn(this, _React$Component2.call(this, props));
  }

  PadBank.prototype.render = function render() {
    var _this4 = this;

    var padBank = undefined;
    this.props.power ? padBank = this.props.currentPadBank.map(function (drumObj, i, padBankArr) {
      return React.createElement(DrumPad, {
        clipId: padBankArr[i].id,
        clip: padBankArr[i].url,
        keyTrigger: padBankArr[i].keyTrigger,
        keyCode: padBankArr[i].keyCode,
        updateDisplay: _this4.props.updateDisplay,
        power: _this4.props.power });
    }) : padBank = this.props.currentPadBank.map(function (drumObj, i, padBankArr) {
      return React.createElement(DrumPad, {
        clipId: padBankArr[i].id,
        clip: '#',
        keyTrigger: padBankArr[i].keyTrigger,
        keyCode: padBankArr[i].keyCode,
        updateDisplay: _this4.props.updateDisplay,
        power: _this4.props.power });
    });
    return React.createElement(
      'div',
      { className: 'pad-bank' },
      padBank
    );
  };

  return PadBank;
}(React.Component);

var App = function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    _classCallCheck(this, App);

    var _this5 = _possibleConstructorReturn(this, _React$Component3.call(this, props));

    _this5.state = {
      power: true,
      display: String.fromCharCode(160),
      currentPadBank: bankOne,
      currentPadBankId: 'Heater Kit',
      sliderVal: 0.3
    };
    _this5.displayClipName = _this5.displayClipName.bind(_this5);
    _this5.selectBank = _this5.selectBank.bind(_this5);
    _this5.adjustVolume = _this5.adjustVolume.bind(_this5);
    _this5.powerControl = _this5.powerControl.bind(_this5);
    _this5.clearDisplay = _this5.clearDisplay.bind(_this5);
    return _this5;
  }

  App.prototype.powerControl = function powerControl() {
    this.setState({
      power: !this.state.power,
      display: String.fromCharCode(160)
    });
  };

  App.prototype.selectBank = function selectBank() {
    if (this.state.power) {
      this.state.currentPadBankId === 'Heater Kit' ? this.setState({
        currentPadBank: bankTwo,
        display: 'Smooth Piano Kit',
        currentPadBankId: 'Smooth Piano Kit'
      }) : this.setState({
        currentPadBank: bankOne,
        display: 'Heater Kit',
        currentPadBankId: 'Heater Kit'
      });
    }
  };

  App.prototype.displayClipName = function displayClipName(name) {
    if (this.state.power) {
      this.setState({
        display: name
      });
    }
  };

  App.prototype.adjustVolume = function adjustVolume(e) {
    var _this6 = this;

    if (this.state.power) {
      this.setState({
        sliderVal: e.target.value,
        display: "Volume: " + Math.round(e.target.value * 100)
      });
      setTimeout(function () {
        return _this6.clearDisplay();
      }, 1000);
    }
  };

  App.prototype.clearDisplay = function clearDisplay() {
    this.setState({
      display: String.fromCharCode(160)
    });
  };

  App.prototype.render = function render() {
    var _this7 = this;

    var powerSlider = this.state.power ? {
      float: 'right'
    } : {
      float: 'left'
    };
    var bankSlider = this.state.currentPadBank === bankOne ? {
      float: 'left'
    } : {
      float: 'right'
    };{
      document.querySelectorAll('.clip').forEach(function (sound) {
        sound.volume = _this7.state.sliderVal;
      });
    }
    return React.createElement(
      'div',
      { id: 'drum-machine', className: 'inner-container' },
      React.createElement(PadBank, {
        power: this.state.power,
        updateDisplay: this.displayClipName,
        clipVolume: this.state.sliderVal,
        currentPadBank: this.state.currentPadBank }),
      React.createElement(
        'div',
        { className: 'logo' },
        React.createElement(
          'div',
          { className: 'inner-logo ' },
          'FCC' + String.fromCharCode(160)
        ),
        React.createElement('i', { className: 'inner-logo fa fa-free-code-camp' })
      ),
      React.createElement(
        'div',
        { className: 'controls-container' },
        React.createElement(
          'div',
          { className: 'control' },
          React.createElement(
            'p',
            null,
            'Power'
          ),
          React.createElement(
            'div',
            { onClick: this.powerControl, className: 'select' },
            React.createElement('div', { style: powerSlider, className: 'inner' })
          )
        ),
        React.createElement(
          'p',
          { id: 'display' },
          this.state.display
        ),
        React.createElement(
          'div',
          { className: 'volume-slider' },
          React.createElement('input', { type: 'range', min: '0', max: '1', step: '0.01', value: this.state.sliderVal, onChange: this.adjustVolume })
        ),
        React.createElement(
          'div',
          { className: 'control' },
          React.createElement(
            'p',
            null,
            'Bank'
          ),
          React.createElement(
            'div',
            { onClick: this.selectBank, className: 'select' },
            React.createElement('div', { style: bankSlider, className: 'inner' })
          )
        )
      )
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));