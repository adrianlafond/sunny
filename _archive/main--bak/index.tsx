import { FunctionalComponent, h } from 'preact';
import { Router, RouterOnChangeArgs } from 'preact-router';
import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import classnames from 'classnames';
import { RootState } from '../../store'
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  updatePath,
  updatePanning,
  updatePanningDelta,
  updateZoomStatus
} from '../../features';
import { Content } from '../content';
import style from './style.scss';

export const Main: FunctionalComponent = () => {
  const dragStart = useRef({ x: 0, y: 0 });

  const zoom = useAppSelector((state: RootState) => state.zoom);
  const dispatch = useAppDispatch();

  const isGrabbing = useRef(false);

  function handleRouterChange(event: RouterOnChangeArgs) {
    dispatch(updatePath(event.url));
  }

  function getInputPosition(event: TouchEvent | MouseEvent) {
    if ('touches' in event) {
      return {
        x: (event as TouchEvent).touches[0].clientX,
        y: (event as TouchEvent).touches[0].clientY,
      };
    }
    return {
      x: (event as MouseEvent).clientX,
      y: (event as MouseEvent).clientY,
    };
  }

  function handleTouchStart(event: TouchEvent) {
    window.removeEventListener('mousedown', handleMouseDown);
    isGrabbing.current = true;
    dragStart.current = getInputPosition(event);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
  }

  function handleMouseDown(event: MouseEvent) {
    isGrabbing.current = true;
    dragStart.current = getInputPosition(event);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  function handleMove(event: TouchEvent | MouseEvent) {
    const position = getInputPosition(event);
    const deltaX = position.x - dragStart.current.x;
    const deltaY = position.y - dragStart.current.y;
    if (deltaX !== 0 || deltaY !== 0) {
      dispatch(updatePanningDelta({
        x: deltaX * 0.5,
        y: deltaY * 0.5,
      }));
    }
  }

  function handleUp() {
    stopDragging();
  }

  function stopDragging() {
    isGrabbing.current = false;
    dispatch(updatePanning(false));
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleUp);
    window.removeEventListener('touchcancel', handleUp);
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
  }

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      stopDragging();
    };
  }, []);

  function handleDoubleClick() {
    dispatch(updateZoomStatus(zoom.status === 'in' ? 'out' : 'in'))
  }

  const mainClass = classnames(style.main, {
    [style['main--panning']]: isGrabbing.current,
    [style['main--zoom-out']]: zoom.status === 'out',
  });

  return (
    <main class={mainClass} onDblClick={handleDoubleClick}>
      <Router onChange={handleRouterChange}>
        <Content default />
      </Router>
    </main>
  );
};
