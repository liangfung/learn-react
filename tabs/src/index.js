import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom'
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
      activeIndex = curProps.defaultActiveIndex
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
    const prevIndex = this.state.activeIndex
    console.log('click', this)
    // 
    if (this.state.activeIndex !== activeIndex && 'defaultActiveIndex' in this.props) {
      this.setState({
        activeIndex,
        prevIndex
      })
      // 执行回调
      this.props.onChange({activeIndex, prevIndex})
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
          onClick: () => {this.props.onTabClick(order)}
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
      <div className={rootClass} role="tablist">
        <ul className={classes}>
          {this.getTabs()}
        </ul>
      </div>
    )
  }
}

class TabContent extends Component {

  getTabContent() {
    const {classPrefix, panels, activeIndex} = this.props
    return React.Children.map(panels, child => {
      if (!child) {return;}

      const order = parseInt(child.props.order, 10);
      const isActive = activeIndex === order;
      return cloneElement(child, {
        classPrefix,
        isActive,
        children: child.props.children,
        key: `tabpanel-${order}`
      })
    })
  }

  render() {
    const {classPrefix} = this.props
    const classes = classnames({
      [`${classPrefix}-content`]: true
    })

    return (
      <div className={classes}>
        {this.getTabContent()}
      </div>
    )
  }
}

class TabPane extends Component {
  
  render() {
    const {classPrefix, children, className, isActive} = this.props

    const classes = classnames({
      [className]: className,
      [`${classPrefix}-panel`]: true,
      [`${classPrefix}-active`]: isActive
    })

    return (
      <div
        role="tabpanel"
        className={classes}
        aria-hidden={!isActive}
      >
        {children}
      </div>
    )
  }
}

ReactDOM.render(
  (<Tabs
    classPrefix='tabs'
    defaultActiveIndex={0}
  >
    <TabPane order={0} tab={'1'}>11111</TabPane>
    <TabPane order={1} tab={'2'}>222</TabPane>
    <TabPane order={2} tab={'3'}>333</TabPane>
  </Tabs>),
  document.getElementById('root')
)