import React, { useRef, useEffect, useContext } from 'react';
import { CSSTransition as ReactCSSTransition } from 'react-transition-group';

const TransitionContext = React.createContext({
  parent: {},
})

function useIsInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, [])
  return isInitialRender.current;
}

function CSSTransition({
  show,
  enter = '',
  enterStart = '',
  enterEnd = '',
  leave = '',
  leaveStart = '',
  leaveEnd = '',
  appear,
  unmountOnExit,
  tag = 'div',
  children,
  ...rest
}) {
  const enterClasses = enter.split(' ').filter((s) => s.length);
  const enterStartClasses = enterStart.split(' ').filter((s) => s.length);
  const enterEndClasses = enterEnd.split(' ').filter((s) => s.length);
  const leaveClasses = leave.split(' ').filter((s) => s.length);
  const leaveStartClasses = leaveStart.split(' ').filter((s) => s.length);
  const leaveEndClasses = leaveEnd.split(' ').filter((s) => s.length);
  const removeFromDom = unmountOnExit;

  function addClasses(node, classes) {
    classes.length && node.classList.add(...classes);
  }

  function removeClasses(node, classes) {
    classes.length && node.classList.remove(...classes);
  }

  const nodeRef = React.useRef(null);
  const Component = tag;

  return (
    <ReactCSSTransition
      appear={appear}
      nodeRef={nodeRef}
      unmountOnExit={removeFromDom}
      in={show}
      addEndListener={(done) => {
        const node = nodeRef.current;
        if (!node) return done();

        let timeoutId;

        // 1. Safe handler that prevents child bubbling from breaking animations
        const handleDone = (e) => {
          if (e && e.target !== node) return; 
          node.removeEventListener('transitionend', handleDone);
          clearTimeout(timeoutId);
          done();
        };

        node.addEventListener('transitionend', handleDone);

        // 2. Failsafe: Calculate the exact CSS duration of the element
        const style = window.getComputedStyle(node);
        const durations = style.transitionDuration.split(',').map(t => 
          parseFloat(t) * (t.includes('ms') ? 1 : 1000)
        );
        const maxDuration = Math.max(...durations) || 0;

        // 3. Fallback timeout in case the browser drops the transitionend event
        timeoutId = setTimeout(handleDone, maxDuration + 50); // 50ms buffer
      }}
      onEnter={() => {
        if (!removeFromDom) nodeRef.current.style.display = null;
        addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses])
      }}
      onEntering={() => {
        removeClasses(nodeRef.current, enterStartClasses)
        addClasses(nodeRef.current, enterEndClasses)
      }}
      onEntered={() => {
        removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses])
      }}
      onExit={() => {
        addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses])
      }}
      onExiting={() => {
        removeClasses(nodeRef.current, leaveStartClasses)
        addClasses(nodeRef.current, leaveEndClasses)
      }}
      onExited={() => {
        removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses])
        if (!removeFromDom) nodeRef.current.style.display = 'none';
      }}
    >
      <Component ref={nodeRef} {...rest} style={{ display: !removeFromDom ? 'none': null }}>{children}</Component>
    </ReactCSSTransition>
  )
}

function Transition({ show, appear, ...rest }) {
  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    )
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  )
}

export default Transition;