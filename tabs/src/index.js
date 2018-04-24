import React, {Component, PropTypes, cloneElement} from 'react';
import classnames from 'classnames'
import './tabs.scss'

class Tabs extends Component {
  // static propTypes = {
  //   className: PropTypes.string,
  //   classPrefix: PropTypes.string
  // }
  static defaultProps = {
    classPrefix: 'tabs',
    onChange: () => {}
  }

  constructor(props) {
    super(props)

    const curProps = this.props
    let activeIndex;
    if ('activeIndex' in curProps) {
      activeIndex = curProps.activeIndex
    } else if ('defaultActiveIndex' in curProps) {
      activeIndex = curprops.defaultActiveIndex
    }

    this.state = {
      activeIndex,
      prevIndex: activeIndex
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('activeIndex' in nextProps) {
      this.setState({activeIndex: nextProps.activeIndex})
    }
  }

  handleTabClick = activeIndex => {
    const preIndex = this.state.activeIndex
    
    // 
    if (this.state.activeIndex !== activeIndex && 'defaultActiveIndex' in this.props) {
      this.setState({
        activeIndex,
        prevIndex
      })
      // 执行回调
      this.props.onChange({activeIndex, preIndex})
    }
  }

  renderTabNav = () => {
    const {classPrefix, children} = this.props
    return (
      <TabNav
        key='tabBar'
        classPrefix={classPrefix}
        onTabClick={this.handleTabClick}
        panels={children}
        actveIndex={this.state.activeIndex}
      />
    )
  }

  renderNavContent = () => {
    const {children, classPrefix} = this.props;
    return (
      <TabContent
        key='tabContent'
        activeIndex={this.state.activeIndex}
        panels={children}
        classPrefix={classPrefix}
      />
    )
  }

  render() {
    const {className} = this.props
    // classnames用于合并class
    const classes = classnames(className, 'ui-tabs')
    return (
      <div className={classes}>
        {this.renderTabNav()}
        {this.renderNavContent()}
      </div>
    )
  }
  
}


class TabNav extends Component {

  getTabs() {
    const {panels, classPrefix, activeIndex} = this.props;
    return React.Children.map(panels, child => {
      if (!child) return;
      const order = parseInt(child.props.order, 10)
      let classes = classnames({
        [`${classPrefix}-tab`]: true,
        [`${classPrefix}-active`]: activeIndex === order,
        [`${classPrefix}-disabled`]: child.props.disabled
      });

      let events = {}
      if(!child.props.disabled) {
        events = {
          onClick: this.props.onTabClick.bind(this, order)
        }
      }

      const ref = {}
      if (activeIndex === order) {
        ref.ref = 'activeTab'
      }
      return (
        <li
          role="tab"
          aria-disabled={child.props.disabled ? 'true': 'false'}
          aria-selected={activeIndex === order ? 'true' : 'false'}
          {...events}
          className={classes}
          key={order}
          {...ref}
        >
          {child.props.tab}
        </li>
      )

    })
  }

  render() {
    const {classPrefix} = this.props;
    const rootClass = classnames({
      [`${classPrefix}-bar`]: true
    })
    const classes = classnames({
      [`${classPrefix}-nav`]: true
    })

    return (
      <div className={rootClasses} role="tablist">
        <ul className={classes}>
          {this.getTabs()}
        </ul>
      </div>
    )
  }
}