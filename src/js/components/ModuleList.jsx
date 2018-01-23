import Button from './Button.jsx';
import PopUp from './PopUp.jsx';
import React from 'react';
import '../../scss/components/ModuleList.scss';

export default class ModuleList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.state = {
      loading: true,
      data: []
    }
  }

  loadingTemplate() {
    return (
      <div className="wrap-popup-loader">
        <span className="spin"></span>
      </div>
    )
  }

  listTemplate() {
    return (
      <div>
        {
          this.state.data.map((data, index) => {
            return (
              <div className="wrap-module-list" key={index}>
                <span className="module-name">{ data.name }</span>
                <p className="module-id">{ data.id }</p>
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className="row">
        {
          this.state.loading ? this.loadingTemplate.bind(this)() : this.listTemplate.bind(this)()
        }
      </div>
    )
  }
}
