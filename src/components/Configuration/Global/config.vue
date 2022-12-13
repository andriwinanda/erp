<template>
  <div>
    <form>
      <!-- Primary -->
      <div class="flat-card">
        <div class="card-content">
          <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
          <p class="modal-card-title">Primary Details</p>
          <hr />
          <b-field grouped group-multiline>
            <b-field label="Company Name">
              <b-input v-model="name" expanded />
            </b-field>
            <b-field label="City" expanded>
              <b-select expanded placeholder="Select City" v-model="city">
                <!-- <option
                  v-for="currency in currencyList"
                  :value="currency.code"
                  :key="currency.id"
                >{{currency.code}}</option>-->
              </b-select>
            </b-field>
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="Zip Code">
              <b-input v-model="zip" />
            </b-field>
            <b-field label="Address" expanded>
              <b-input v-model="address" type="textarea" expanded />
            </b-field>
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="Phone 1" expanded>
              <b-input v-model="phone1" />
            </b-field>
            <b-field label="Phone 2" expanded>
              <b-input v-model="phone2" />
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field label="Email" expanded>
              <b-input type="email" v-model="email" />
            </b-field>
            <b-field label="Billing Email" expanded>
              <b-input type="email" v-model="billing_email" />
            </b-field>
            <b-field label="Technical" expanded>
              <b-input type="email" v-model="technical_email" />
            </b-field>
            <b-field label="CC Email" expanded>
              <b-input type="email" v-model="cc_email" />
            </b-field>
          </b-field>
        </div>
        <br />
      </div>
      <br />
      <!-- Bank Details -->
      <div class="flat-card">
        <div class="card-content">
          <p class="modal-card-title">Bank Details</p>
          <hr />
          <b-field grouped group-multiline>
            <b-field label="Account Name">
              <b-input v-model="acc_name" />
            </b-field>
            <b-field label="Account No">
              <b-input v-model="acc_no" />
            </b-field>
            <b-field label="Bank Details" expanded>
              <b-input v-model="acc_details" />
            </b-field>
          </b-field>
        </div>
        <br />
      </div>
      <br />
      <!-- Site Configuration -->
      <div class="flat-card">
        <div class="card-content">
          <p class="modal-card-title">Site Configuration</p>
          <hr />

          <b-field label="Site Name">
            <b-input v-model="site_name" />
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="Site Meta Description" expanded>
              <b-input v-model="site_desc" type="textarea" />
            </b-field>
            <b-field label="Site Meta Keywords" expanded>
              <b-input v-model="site_keyword" type="textarea" />
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
        </div>
        <br />
      </div>
      <br />
      <!-- Management Config -->
      <div class="flat-card">
        <div class="card-content">
          <p class="modal-card-title">Management Configuration</p>
          <hr />
          <b-field grouped group-multiline>
            <b-field label="Manager">
              <b-input v-model="mng_name" />
            </b-field>
            <b-field label="Accounting">
              <b-input v-model="mng_accounting" />
            </b-field>
            <b-field label="Web Email - Link" expanded>
              <b-input v-model="mng_webmail" />
            </b-field>
          </b-field>
        </div>
        <br />
      </div>
      <br />
      <!-- Accounting Period -->
      <div class="flat-card">
        <div class="card-content">
          <p class="modal-card-title">Accounting Period</p>
          <hr />
          <div class="label">Begin Period</div>
          <b-field grouped group-multiline>
            <b-field expanded>
              <b-select v-model="begin_month" placeholder="Select month" expanded>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">Augst</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </b-select>
            </b-field>
            <b-field expanded>
              <b-input v-model="begin_year" placeholder="Year" type="number" />
            </b-field>
          </b-field>
          <div class="label">Period</div>
          <b-field grouped group-multiline>
            <b-field expanded>
              <b-select v-model="month" placeholder="Select month" expanded>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">Augst</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </b-select>
            </b-field>
            <b-field expanded>
              <b-input v-model="year" placeholder="Year" type="number" />
            </b-field>
          </b-field>
          <b-field label="Year End">
            <b-select v-model="end_month" placeholder="Select month">
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">Augst</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </b-select>
          </b-field>
        </div>
        <br />
      </div>
      <div class="section">
        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="editConfig()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
      name: "",
      city: "",
      zip: "",
      address: "",
      phone1: "",
      phone2: "",
      email: "",
      billing_email: "",
      technical_email: "",
      cc_email: "",
      acc_name: "",
      acc_no: "",
      acc_details: "",
      site_name: "",
      site_desc: "",
      site_keyword: "",
      mng_name: "",
      mng_accounting: "",
      mng_webmail: "",
      begin_month: null,
      begin_year: "",
      month: null,
      year: "",
      end_month: null,
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
    },
    editConfig(event) {
      let configData = new FormData();
      configData.append("timage_url", this.userfile);
      configData.append("tname", this.tname);
      configData.append("taddress", this.address);
      configData.append("tphone1", this.phone1);
      configData.append("tphone2", this.phone2);
      configData.append("tmail", this.email);
      configData.append("tbillmail", this.billing_email);
      configData.append("ttechmail", this.technical_email);
      configData.append("tccmail", this.cc_email);
      configData.append("ccity", this.city);
      configData.append("tzip", this.zip);
      configData.append("taccount_name", this.acc_name);
      configData.append("taccount_no", this.acc_name);
      configData.append("tbank", this.acc_details);
      configData.append("tmanager", this.mng_name);
      configData.append("taccounting", this.mng_accounting);
      configData.append("twebmail", this.mng_webmail);
      configData.append("cbegin_month", this.begin_month);
      configData.append("tbegin_year", this.begin_year);
      configData.append("cmonth", this.month);
      configData.append("tyear", this.year);
      configData.append("cend_month", this.end_month);

      this.axios
        .post(`/configuration/update/4`, configData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          swal("Success!", "Submit successfully!", "success");
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    loadAsyncConfig() {
      this.axios
        .get("/configuration")
        .then(res => {
          let data = res.data.content;
          this.name = data.name;
          this.city = data.city;
          this.zip = data.zip;
          this.address = data.address;
          this.phone1 = data.phone1;
          this.phone2 = data.phone2;
          this.email = data.email;
          this.billing_email = data.billing_email;
          this.technical_email = data.technical_email;
          this.cc_email = data.cc_email;
          this.acc_name = data.account_name;
          this.acc_no = data.account_no;
          this.acc_details = data.bank;
          this.site_name = data.site_name;
          this.site_desc = data.meta_description;
          this.site_keyword = data.meta_keyword;
          this.mng_name = data.manager;
          this.mng_accounting = data.accounting;
          this.mng_webmail = data.webmail;
          this.begin_month = data.start_month;
          this.begin_year = data.start_year;

          this.month = data.month;
          this.year = data.year;
          this.end_month = data.closing_month;
          this.file_url = data.logo_url;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
created() {
    this.loadAsyncConfig();
  }
};
</script>