import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {Titulo} from './Titulo';

const PAPER = '#FBFBF8';

const TituloOnPaper: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: PAPER}}>
    <Titulo />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Titulo" component={Titulo} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition
      id="TituloOnPaper"
      component={TituloOnPaper}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
  </>
);
