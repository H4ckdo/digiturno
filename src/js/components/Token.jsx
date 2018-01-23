import Button from './Button.jsx';
import PopUp from './PopUp.jsx';
import React from 'react';

export default class Token extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.state = {
      dispatched: this.props.dispatched
    }
  }//end constructor

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
  }//end componentDidMount

  render() {
    return (
      <div className="row large-12">
        <h1 className="turno-name columns large-3">{ this.props.name }</h1>
        <div className="columns large-3 pull-down">
          <Button style="btn-custom" onClick={ this.props.onCall.bind(this, this) } icon={<i className="material-icons">&#xE91F;</i>} data="Llamar"/>
        </div>

        <div className="columns large-3 pull-down">
          <Button disabled={ this.state.dispatched } style="btn-confirm" lift={ this.addChildren.bind(this, "despachar") } onClick={ this.props.onDispatch.bind(this, this) } data={"Despachar"} />
        </div>

        <div className="columns large-3 pull-down">
          <Button style="btn-cancel" onClick={ this.props.onCancel.bind(this, this) } data="Cancelar"/>
        </div>
      </div>
    )
  }
}//end Token
