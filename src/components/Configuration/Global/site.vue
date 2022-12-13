<template>
  <div>
    <form>
      <!-- Site Configuration -->
      <div class="flat-card">
        <div class="card-content">
          <p class="modal-card-title">Site Configuration</p>
          <hr />

          <b-field label="Site Name">
            <b-input v-model="name" />
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="Site Meta Description" expanded>
              <b-input v-model="desc" type="textarea" />
            </b-field>
            <b-field label="Site Meta Keywords" expanded>
              <b-input v-model="keyword" type="textarea" />
            </b-field>
          </b-field>
          <b-field label="Upload Image">
            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  type="file"
                  accept="image/*"
                  id="file"
                  ref="myFiles"
                  class="file-input"
                  @change="previewFiles"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">Choose a file…</span>
                </span>
                <span class="file-name" v-if="userfile">{{userfile.name || file_url}}</span>
                <span class="file-name" v-else>No image choosen</span>
              </label>
            </div>
          </b-field>
          <img v-if="file_url" class="image" :src="file_url" style="max-height: 150px" />
          <br />
          <p class="has-text-right">
            <button class="button is-primary" @click.prevent="submitCashin()">Save</button>
            <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      file_url: "",
      userfile: null
    };
  },
  methods: {
    previewFiles() {
      let files = this.$refs.myFiles.files;
      this.userfile = files[0];
      console.log(this.userfile);
      if (this.userfile) {
        this.file_url = URL.createObjectURL(this.userfile);
      } else {
        this.file_url = "";
      }
    }
  }
};
</script>