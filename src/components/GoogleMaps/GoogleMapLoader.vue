<template>
  <div id="container">
    <div id="map"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot :google="google" :map="map" />
    </template>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: "GoogleMapLoader",
  data() {
    return {
      google: null,
      map: null,
    };
  },
  async mounted() {
    const loader = new Loader({
      apiKey: "AIzaSyCwev37Sc3k7fj7sqbnDgL9qh3IwEdrC3c",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      this.google = window.google;
      this.map = new this.google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      // var marker = new this.google.maps.Marker({
      //   position: { lat: -34.397, lng: 150.644 },
      //   map: this.map,
      //   label: {
      //     text: "\ue530",
      //     fontFamily: "Material Icons",
      //     color: "#ffffff",
      //     fontSize: "18px",
      //   },
      //   draggable: true,
      //   title: "Material Icon Font Marker",
      // });

      // this.google.maps.event.addListener(marker, "dragend", function () {
      //   console.log(this.getPosition().lat());
      //   console.log(this.getPosition().lng());
      // });
    });
  },
};
</script>

<style>
#container {
  height: 100%;
}
</style>