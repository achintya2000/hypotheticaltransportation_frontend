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
  props: {
    markers: {
      type: Array,
      required: true,
    },
  },
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
        center: { lat: 36.0006935, lng: -78.9480547 },
        zoom: 12,
      });

      var bounds = new this.google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].position);
      }
      this.map.fitBounds(bounds);
    });
  },
};
</script>

<style>
#container {
  height: 100%;
}
</style>