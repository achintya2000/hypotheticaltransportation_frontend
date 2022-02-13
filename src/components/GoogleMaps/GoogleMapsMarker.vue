<script>
export default {
  props: {
    google: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    marker: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    var marker = new this.google.maps.Marker({
      position: this.marker.position,
      label: this.marker.label,
      marker: this.marker,
      map: this.map,
      draggable: true,
    });

    this.google.maps.event.addListener(marker, "dragend", function () {
      console.log(this.getPosition().lat());
      console.log(this.getPosition().lng());
    });
  },
  // eslint-disable-next-line vue/require-render-return
  render() {},
};
</script>
