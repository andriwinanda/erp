<template>
  <form id="formAdd">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Add New Vendor</p>
      </header>
      <section class="modal-card-body">
        <b-field grouped group-multiline>
          <b-field label="Name" expanded>
            <b-input></b-input>
          </b-field>
          <b-field label="Contact Person" expanded>
            <b-input></b-input>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Phone" expanded>
            <b-input></b-input>
          </b-field>
          <b-field label="Mobile" expanded>
            <b-input></b-input>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="Email" expanded>
            <b-input type="email"></b-input>
          </b-field>
          <b-field label="Vendor Type">
            <b-select expanded placeholder="Select Type">
              <option>Personal</option>
              <option>Company</option>
            </b-select>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <b-field label="NPWP" expanded>
            <b-input></b-input>
          </b-field>
          <b-field label="FAX" expanded>
            <b-input></b-input>
          </b-field>
        </b-field>

        <b-field label="Address">
          <b-input type="textarea" expanded></b-input>
        </b-field>
        <b-checkbox>Use this address for shiping</b-checkbox>
        <b-field label="Province">
          <b-select placeholder="Select a character" expanded>
            <option value="flint">Sumatera Utara</option>
            <option value="silver">Sumatera Selatan</option>
          </b-select>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click="submit()">Save</button>
        <button class="button is-danger" type="button" @click="$parent.close()">Close</button>
        <button class="button is-warning" type="button" @click="reset()">Reset</button>
      </footer>
    </div>
  </form>
</template>
<script>
export default {
  props: ["email", "password"],
  methods: {
    reset() {
      document.getElementById("formAdd").reset();
    },
    submit() {
      alert(this.email);
    }
  }
};
</script>

