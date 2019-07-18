import React from 'react';
import connect from 'hoc/connect';
import { withStyles } from 'material-ui/styles';

import store from 'store';
import { subscribe, unsubscribe } from 'engine/loop';
import { strokerRemoteControl } from 'game/loops/strokerLoop';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '80px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
});

class BeatMeter extends React.Component {

  constructor(props) {
    super(props);

    this.loopId = null;
    this.scrollSpeed = 300;
    this.risingSpeed = 1.5;
    this.beatWidth = 100;
    this.beatHeight = 50;
    this.sampleWidth = 10;
    this.baseline = 20;
    this.noise = 10;
    this.lastStrokeSpeed = 0;
    this.lastStrokeAcceleration = 0;
    this.lastStrokeCount = 0;
    this.lastPauseStatus = false;
    this.frameRate = 60;
    this.lastBeat = null;
    this.pastBeats = [];
    this.obsoleteBeats = [];
    this.futureBeats =  [];
  }

  render() {
    return (
      <canvas ref='canvas' className={this.props.classes.root}></canvas>
    );
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');

    this.resizeListener = this.resize.bind(this);
    window.addEventListener('resize', this.resizeListener);
    this.resize();

    this.loopId = subscribe(this.loop.bind(this));
  }

  resize() {
    const { canvas } = this.refs;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  loop(progress) {
    this.frameRate = 1 / (progress / 1000);
    this.updateBeats();
    this.draw();
  }

  updateBeats() {
    const { strokes, strokeSpeed, strokeAcceleration } = store.game;
    const { width } = this.refs.canvas;

    if (strokerRemoteControl.paused !== this.lastPauseStatus) {
      this.lastPauseStatus = strokerRemoteControl.paused;
      this.removeFutureBeats();
    }
    if (strokerRemoteControl.paused) {
      this.updateBeatPositions();
      return
    }
    
    if (strokeAcceleration !== this.lastStrokeAcceleration) {
      this.lastStrokeAcceleration = strokeAcceleration;
      this.updateBeatPositions();
      this.predictFutureBeats(this.lastBeat ? this.lastBeat.pos : width / 2, false);
    } else if (strokeSpeed !== this.lastStrokeSpeed && !strokeAcceleration) {
      this.lastStrokeSpeed = strokeSpeed;
      this.updateBeatPositions();
      this.predictFutureBeats(this.lastBeat ? this.lastBeat.pos : width / 2, false);
    } else if (strokes > this.lastStrokeCount) {
      this.lastStrokeCount = strokes;

      // Add current beat
      this.lastBeat = {
        pos: width / 2,
        state: 1,
        color: this.getColor(strokeSpeed),
      };
      this.pastBeats.push(this.lastBeat);

      this.updateBeatPositions();
      this.predictFutureBeats(this.lastBeat ? this.lastBeat.pos : width / 2, true);
    } else {
      this.updateBeatPositions();
    }
  }

  updateBeatPositions() {
    // Scroll all beats to the left
    const scrollAmount = 1 / this.frameRate * this.scrollSpeed;
    this.pastBeats.forEach(
      beat => beat.pos = beat.pos - scrollAmount,
    );
    this.futureBeats.forEach(
      beat => beat.pos = beat.pos - scrollAmount,
    );
    this.obsoleteBeats.forEach(
      beat => beat.pos = beat.pos - scrollAmount,
    );

    // Update beat states
    this.futureBeats.forEach(beat => {
      if (beat.state < 1) beat.state = beat.state + this.risingSpeed / this.frameRate;
      if (beat.state > 1) beat.state = 1;
    });
    this.obsoleteBeats.forEach(beat => {
      beat.state = beat.state - this.risingSpeed / this.frameRate;
    });

    // Filter out beats that go over the screen or are obsolete
    // Keep the latest beat
    this.pastBeats = this.pastBeats.filter(
      ({ pos }) => pos + this.beatWidth > 0,
    );
    if (!this.pastBeats) this.pastBeats.push(this.lastBeat);
    this.futureBeats = this.futureBeats.filter(
      ({ pos }) => pos + this.beatWidth > 0,
    );
    this.futureBeats = this.futureBeats.filter(
      ({ pos }) => pos + this.beatWidth > 0,
    );
    this.obsoleteBeats = this.obsoleteBeats.filter(
      ({ state }) => state > 0,
    );
  }

  predictFutureBeats(startPosition, correction = false) {
    let { strokeSpeed } = store.game;
    const { strokeAcceleration } = store.game;
    const { width } = this.refs.canvas;

    // Predict future beats
    let x = startPosition;
    let beatInterval = null;
    this.futureBeats = [];
    do {
      strokeSpeed = strokeSpeed + (strokeAcceleration || 0);
      const beatRate = strokeSpeed / this.scrollSpeed;
      beatInterval = 1 / beatRate;
      x += beatInterval;
      this.futureBeats.push({
          pos: x,
          state: correction ? 1 : 0,
          color: this.getColor(strokeSpeed),
      });
    } while (x < width + beatInterval)
  }

  removeFutureBeats() {
    this.obsoleteBeats = this.futureBeats;
    this.futureBeats = [];
  }

  getColor(strokeSpeed) {
    const { fastestStrokeSpeed, slowestStrokeSpeed } = store.config;
    const strokeSpeedPercent =
        (strokeSpeed - slowestStrokeSpeed) /
        (fastestStrokeSpeed - slowestStrokeSpeed);
    return [
      strokeSpeedPercent * 255,
      (1 - strokeSpeedPercent) * 255,
      0,
    ];
  }

  draw() {
    const { width, height } = this.refs.canvas;
    // const color = this.getColor(strokeSpeed);

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw scope
    this.ctx.fillStyle = 'rgba(245, 0, 87, 0.5)';
    this.ctx.fillRect(width / 2 - this.beatWidth / 2, 0, this.beatWidth, height);

    // Draw baseline
    // this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    this.ctx.fillStyle = 'rgba(245, 0, 87)';
    for (let x = 0; x < width; x += this.sampleWidth) {
      const y = this.baseline + Math.random() * this.noise;
      this.ctx.fillRect(x, height - y, this.sampleWidth, y);
    }

    // Draw beats
    this.ctx.lineWidth = 5;
    this.pastBeats.forEach(this.drawBeat.bind(this));
    this.futureBeats.forEach(this.drawBeat.bind(this));
    this.obsoleteBeats.forEach(this.drawBeat.bind(this));
  }

  drawBeat({pos: x, state, color}) {
    const bw = this.beatWidth;
    const bh = this.beatHeight;
    const { width: w, height: h } = this.refs.canvas;
    // const f = (x) => (-h*(Math.sqrt(w*x)-w))/(2*w);
    // const f = (x) => -2*h*x*(x-w)/w**2+h/2;
    const f = (x) => -4*bh/bw**2*(x-bw/2)**2+bh; // On x-axis after y-axis

    const distanceToCenter = Math.abs(x + bw / 2 - w / 2);
    const jump = 1 / distanceToCenter * 100;

    // this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    this.ctx.fillStyle = `rgb(${245 + jump}, 0, ${87 + jump})`;
    this.ctx.strokeStyle = `rgb(${185 + jump}, 0, ${27 + jump})`;
    
    for (let dx = 0; dx < bw; dx += this.sampleWidth) {
      const value = (f(dx) + f(dx + this.sampleWidth)) / 2;
      const noise = Math.random() * this.noise;
      let y = value * state + noise + jump;
      if (y <= 0) continue;
      this.ctx.fillRect(x + dx, h - y, this.sampleWidth, y);

      this.ctx.beginPath()
      this.ctx.moveTo(x + dx, h - y);
      this.ctx.lineTo(x + dx + this.sampleWidth, h - y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
    unsubscribe(this.loop);
  }
}

export default withStyles(styles)(connect(BeatMeter));