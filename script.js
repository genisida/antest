"use strict";
import { sketch } from "/module/render.mjs";
import { AudioVisualizer } from "/module/visualizer.mjs";
import "https://code.jquery.com/jquery-3.3.1.min.js";
import "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js";

$("#init").click(async () => {
  let volume = 0.5;
  const audio = new AudioVisualizer({ type: "buffer", });
  $("#state").click(() => {
    console.log(audio.toggle().state);
    $(this).html(audio.state ? "stop" : "play");
  });
  $("#stop").click(() => audio.stop());
  $("#volume").change(e => volume = e.target.value);
  $("#color").change(e => $("body").css({ background: e.target.value }));
  $("#file").change(async e => await audio.setFile(e.target.files[0]));
  $(
    new p5(sketch($("main")[0])(() => [audio.update().data, volume])).canvas
  ).css({ width: "", height: "" })
  new Promise(r =>
    $("#splash").animate({ opacity: 0 }, 1000, r)
  ).then(() =>
    $("#splash").css({ display: "none" })
  )
});