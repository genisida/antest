"use strict";
import { sketch } from "./module/render.mjs";
import { AudioVisualizer } from "./module/visualizer.mjs";
import "https://code.jquery.com/jquery-3.3.1.min.js";
import "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js";

$("#init").click(async () => {
  let volume = 0.5;
  const audio = new AudioVisualizer({ type: "buffer", });
  $("#state").click(e => $(e.target).html(audio.toggle().state ? "stop" : "play"));
  $("#volume").change(e => volume = e.target.value);
  $("#color").change(e => $("body").css({ background: e.target.value }));
  $("#file").change(async e => await audio.setFile(e.target.files[0]));
  new p5(sketch(() => [audio.update().data, volume]), "main");
  new Promise(r => $("#splash").animate({ opacity: 0 }, 1000, r))
    .then(() => $("#splash").hide())
});
