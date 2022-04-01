import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import { NavigationContext, ThemeContext } from '../../contexts';
import style from './style.scss';

export const Content: FunctionalComponent = () => {
  const theme = useContext(ThemeContext);
  const navigation = useContext(NavigationContext);

  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content.current) {
      return;
    }
    const el = content.current;
    if (navigation.path.startsWith('/preferences')) {
      el.style.transform = `translateY(-${window.innerHeight}px)`;
    } else {
      el.style.transform = 'translateY(0)';
    }
  }, [navigation.path]);

  return (
    <ThemeContext.Provider value={theme}>
      <div class={style.content} ref={content}>
        <Forecasts />
        <Preferences />
      </div>
    </ThemeContext.Provider>
  );
};
