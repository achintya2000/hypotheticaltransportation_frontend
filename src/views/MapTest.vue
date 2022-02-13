<template>
  <GoogleMapLoader>
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from "../components/GoogleMaps/GoogleMapLoader.vue";
import GoogleMapMarker from "../components/GoogleMaps/GoogleMapsMarker.vue";

export default {
  components: { GoogleMapLoader, GoogleMapMarker },
  data() {
    return {
      markers: [
        {
          id: "a",
          position: { lat: 3, lng: 101 },
          label: {
            text: "\ue530",
            fontFamily: "Material Icons",
            color: "#ffffff",
            fontSize: "18px",
          },
        },
        {
          id: "b",
          position: { lat: 5, lng: 99 },
          label: {
            text: "\ue530",
            fontFamily: "Material Icons",
            color: "#ffffff",
            fontSize: "18px",
          },
        },
        {
          id: "c",
          position: { lat: 6, lng: 97 },
          label: {
            text: "\ue530",
            fontFamily: "Material Icons",
            color: "#ffffff",
            fontSize: "18px",
          },
        },
      ],
    };
  },
};
</script>

<style>
#map {
  height: 100%;
}
</style>