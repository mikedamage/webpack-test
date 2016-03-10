import React from 'react';

class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  handleChange(evt) {
    this.setState({
      name: evt.target.value
    });
  }

  render() {
    return (
      <div className="text-box">
        <label htmlFor="name">{this.props.label}</label>
        <input onChange={this.handleChange.bind(this)} id="name" />
        <p>
          <strong>{this.props.msgLabel}</strong>
          {this.state.name}
        </p>
      </div>
    );
  }
}

export default TextBox;
