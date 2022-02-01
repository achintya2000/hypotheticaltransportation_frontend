<template>
  <div>
    <div>
      <h2>Search and add a pin</h2>
      <gmap-autocomplete @place_changed="setPlace">
        <template v-slot:input="slotProps">
          <v-text-field
            v-model="address"
            label="Address"
            placeholder="Location Of Event"
            ref="input"
            v-on:listeners="slotProps.listeners"
            v-on:attrs="slotProps.attrs"
          >
          </v-text-field>
        </template>
      </gmap-autocomplete>
      <v-btn @click="addMarker">Add</v-btn>
    </div>
    <br />
    <GmapMap :center="center" :zoom="12" style="width: 100%; height: 400px">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="
          center = m.position;
          toggleInfo(m, index);
        "
        :icon="getMarkers(index)"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    let mapMarker =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyMyAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0yMyAxMS41QzIzIDIxLjUgMTEuNSAyOC41IDExLjUgMjguNUMxMS41IDI4LjUgMCAyMS41IDAgMTEuNUMwIDUuMTQ4NzMgNS4xNDg3MyAwIDExLjUgMEMxNy44NTEzIDAgMjMgNS4xNDg3MyAyMyAxMS41WiIgZmlsbD0iI0M3MDYyOSIvPg0KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjExLjUiIHI9IjUuNSIgZmlsbD0iIzgxMDAxNyIvPg0KPC9zdmc+DQo=";
    let mapMarkerActive =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyMyAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0yMyAxMS41QzIzIDIxLjUgMTEuNSAyOC41IDExLjUgMjguNUMxMS41IDI4LjUgMCAyMS41IDAgMTEuNUMwIDUuMTQ4NzMgNS4xNDg3MyAwIDExLjUgMEMxNy44NTEzIDAgMjMgNS4xNDg3MyAyMyAxMS41WiIgZmlsbD0iIzMzMzMzMyIvPg0KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjExLjUiIHI9IjUuNSIgZmlsbD0iYmxhY2siLz4NCjwvc3ZnPg0K";

    return {
      mapMarker,
      mapMarkerActive,
      selectedIndex: null,
      selectedMarker: null,
      address: "",
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      markers: [],
      places: [],
    };
  },
  mounted() {
    this.geolocate();
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;

        console.log(JSON.stringify(this.markers));
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    toggleInfo(m, index) {
      this.selectedMarker = m;
      this.selectedIndex = index;
    },
    getMarkers(index) {
      if (this.selectedIndex === index) return this.mapMarkerActive;
      return this.mapMarker;
    },
  },
};
</script>

<style>
</style>