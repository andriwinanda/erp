<template>
  <div>
    <!-- Filter -->
    <div v-if="showFilter" class="flat-card row" style="margin-bottom: 15px;">
      <button
        class="delete is-pulled-right"
        aria-label="close"
        @click.prevent="showFilter = false"
        style="margin: 10px;"
      />
      <div class="card-content">
        <form @submit.prevent="loadFilter()">
          <b-field grouped group-multiline expanded>
            <b-field label="SKU">
              <b-input :value="sku" @input="updateSku" placeholder="Sku" />
            </b-field>
            <b-field label="Branch">
              <b-select placeholder="Select a branch" v-model="branch" expanded>
                <option
                  v-for="branch in branchList"
                  :key="branch.id"
                  :value="branch.code"
                >{{branch.name.toUpperCase()}}</option>
              </b-select>
            </b-field>
            <b-field label="Category">
              <b-select placeholder="Select a category" v-model="category" expanded>
                <option
                  v-for="category in categoryList"
                  :key="category.id"
                  :value="category.id"
                >{{category.code.toUpperCase()}}</option>
              </b-select>
            </b-field>
            <b-field label="Color">
              <b-select placeholder="Select a color" v-model="color" expanded>
                <option
                  v-for="color in colorList"
                  :key="color.id"
                  :value="color.id"
                >{{color.code.toUpperCase()}}</option>
              </b-select>
            </b-field>
            <b-field label="Type">
              <b-select placeholder="Select a type" v-model="ctype" expanded>
                <option value="0">Material</option>
                <option value="1">Product</option>
              </b-select>
            </b-field>
          </b-field>
          <div class="buttons">
            <button class="button is-primary" @click.prevent="loadFilter()">Filter</button>
            <button class="button is-primary" @click.prevent="reset()">Reset</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Main Page -->
    <div class="flat-card">
      <div class="card-content">
        <div class="columns is-multiline">
          <!-- Search -->
          <div class="column is-9">
            <div class="buttons">
              <b-button
                v-if="!showFilter"
                type="is-primary"
                @click.prevent="showFilter = !showFilter"
              >{{showFilter?"Close": "Show"}} Filter</b-button>
              <b-button
                type="is-primary"
                icon-left="refresh"
                @click="loadAsyncProductList()"
              >Refresh Table</b-button>
            </div>
          </div>
          <div class="column is-3">
            <b-field class="control">
              <b-input
                placeholder="Search..."
                type="search"
                icon="magnify"
                :value="search"
                @input="searchProduct"
              />
            </b-field>
          </div>

          <!-- Modal Add Product -->
          <b-modal
            :active.sync="isAddProductModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <form @submit.prevent="submitProduct">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">Add New product</p>
                </header>
                <section class="modal-card-body">
                  <b-field grouped group-multiline>
                    <b-field label="SKU" expanded>
                      <b-input v-model="tsku" />
                    </b-field>
                    <b-field label="Name" expanded>
                      <b-input v-model="tname" />
                    </b-field>
                  </b-field>
                  <b-field grouped group-multiline>
                    <b-field label="Model" expanded>
                      <b-input v-model="tmodel" />
                    </b-field>
                  </b-field>
                  <b-field>
                    <b-field label="Currency">
                      <b-select placeholder="Select a character" v-model="ccur" expanded>
                        <option
                          v-for="currency in currencyList"
                          :key="currency.id"
                          :value="currency.name"
                        >{{currency.code}}</option>
                      </b-select>
                    </b-field>
                  </b-field>
                  <b-field label="Type">
                    <b-select placeholder="Select a type" v-model="ctype" expanded>
                      <option value="0">Material</option>
                      <option value="1">Product</option>
                    </b-select>
                  </b-field>
                  <b-field label="Category">
                    <b-select placeholder="Select a character" v-model="ccategory" expanded>
                      <option
                        v-for="category in categoryList"
                        :key="category.id"
                        :value="category.id"
                      >{{category.name.toUpperCase()}}</option>
                    </b-select>
                  </b-field>
                  <b-field label="Manufacture">
                    <b-select placeholder="Select a character" v-model="cmanufacture" expanded>
                      <option
                        v-for="manufacture in manufactureList"
                        :key="manufacture.id"
                        :value="manufacture.id.toLowerCase()"
                      >{{manufacture.name.toUpperCase()}}</option>
                    </b-select>
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
                </section>
                <footer class="modal-card-foot">
                  <button class="button is-primary" @click.prevent="submitProduct()">Save</button>
                  <button class="button is-danger" type="button" @click="modalCloseClicked">Close</button>
                  <button class="button is-warning" type="button" @click.prevent="reset()">Reset</button>
                </footer>
              </div>
            </form>
          </b-modal>

          <!-- Modal Edit Product -->
          <b-modal
            :active.sync="isEditProductModalActive"
            @close="modalCloseClicked()"
            has-modal-card
          >
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">Edit product</p>
              </header>
              <section class="modal-card-body">
                <b-steps has-navigation v-model="activeStep" size="is-small" style="width: 100%">
                  <!-- Step 1 -->
                  <b-step-item clickable label="General" icon="view-dashboard">
                    <b-field grouped group-multiline>
                      <b-field label="SKU" expanded>
                        <b-input v-model="tsku" />
                      </b-field>
                      <b-field label="Name" expanded>
                        <b-input v-model="tname" />
                      </b-field>
                    </b-field>
                    <b-field grouped group-multiline>
                      <b-field label="Model" expanded>
                        <b-input v-model="tmodel" />
                      </b-field>
                    </b-field>
                    <b-field>
                      <b-field label="Currency">
                        <b-select placeholder="Select a character" v-model="ccur" expanded>
                          <option
                            v-for="currency in currencyList"
                            :key="currency.id"
                            :value="currency.name"
                          >{{currency.code}}</option>
                        </b-select>
                      </b-field>
                    </b-field>
                    <b-field label="Type">
                      <b-select placeholder="Select a type" v-model="ctype" expanded>
                        <option value="0">Material</option>
                        <option value="1">Product</option>
                      </b-select>
                    </b-field>
                    <b-field label="Category">
                      <b-select placeholder="Select a character" v-model="ccategory" expanded>
                        <option
                          v-for="category in categoryList"
                          :key="category.id"
                          :value="category.id"
                        >{{category.name.toUpperCase()}}</option>
                      </b-select>
                    </b-field>
                    <b-field label="Manufacture">
                      <b-select placeholder="Select a character" v-model="cmanufacture" expanded>
                        <option
                          v-for="manufacture in manufactureList"
                          :key="manufacture.id"
                          :value="manufacture.id.toLowerCase()"
                        >{{manufacture.name.toUpperCase()}}</option>
                      </b-select>
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
                  </b-step-item>

                  <!-- Step 2 -->
                  <b-step-item clickable label="Data" icon="file-document-edit-outline">
                    <b-field grouped group-multiline>
                      <b-field label="Meta Tag Title" expanded>
                        <b-input v-model="tmetatitle" type="textarea"></b-input>
                      </b-field>
                    </b-field>
                    <b-field grouped group-multiline>
                      <b-field label="Meta Tag Description" expanded>
                        <b-input v-model="tmetadesc" type="textarea"></b-input>
                      </b-field>
                    </b-field>
                    <b-field grouped group-multiline>
                      <b-field label="Meta Tag Keywords" expanded>
                        <b-input v-model="tmetakeywords" type="textarea"></b-input>
                      </b-field>
                    </b-field>
                  </b-step-item>

                  <!-- Step 3 -->
                  <b-step-item clickable label="Price & Qty" icon="currency-usd">
                    <b-field label="Low - High Price / Discount %">
                      <b-field grouped>
                        <b-field expanded>
                          <b-input v-model="tlowprice" type="number"></b-input>
                        </b-field>
                        <b-field expanded>
                          <b-input v-model="tprice" type="number"></b-input>
                        </b-field>
                        <b-field expanded>
                          <b-input v-model="tdisc_p" type="number"></b-input>
                        </b-field>
                      </b-field>
                    </b-field>
                    <b-field label="Discount Price" expanded>
                      <b-input v-model="tdiscount" type="number"></b-input>
                    </b-field>
                    <b-field label="Min Order" expanded>
                      <b-input v-model="tmin" type="number"></b-input>
                    </b-field>
                  </b-step-item>

                  <!-- Step 4 -->
                  <b-step-item clickable label="Dimension" icon="ruler">
                    <b-field label="Dimension (L x W x H)">
                      <b-field grouped group-multiline>
                        <b-field>
                          <b-input v-model="tlength" type="number" placeholder="length"></b-input>
                        </b-field>
                        <b-field>
                          <b-input v-model="twidth" type="number" placeholder="width"></b-input>
                        </b-field>
                        <b-field>
                          <b-input v-model="theight" type="number" placeholder="height"></b-input>
                        </b-field>
                      </b-field>
                    </b-field>
                    <b-field label="Dimension" expanded>
                      <b-input v-model="cdimension" type="text"></b-input>
                    </b-field>
                    <b-field label="Wieight" expanded>
                      <b-input v-model="tmin" type="number"></b-input>
                    </b-field>
                  </b-step-item>
                </b-steps>
              </section>
              <footer class="modal-card-foot">
                <b-button class="button is-primary" @click.prevent="editProduct()">Save</b-button>
                <b-button class="button is-danger" type="button" @click="modalCloseClicked">Close</b-button>
                <b-button class="button is-warning" type="button" @click.prevent="reset()">Reset</b-button>
              </footer>
            </div>
          </b-modal>

          <!-- Table Product -->
          <div class="column is-12">
            <b-table
              :data="productList"
              :loading="loading"
              hoverable
              :checked-rows.sync="checkedRows"
              :is-row-checkable="(row) => row.id !== 3"
              checkable
            >
              <template slot="empty" v-if="!loading">
                <p
                  class="has-text-grey has-text-centered"
                  style="padding: 10px"
                >No data available in table</p>
              </template>
              <template slot-scope="props">
                <b-table-column label="Branch">{{ props.row.branch }}</b-table-column>
                <b-table-column class="is-capitalized" label="Category">{{ props.row.category }}</b-table-column>
                <b-table-column label="Sku">{{ props.row.sku }}</b-table-column>
                <b-table-column class="is-capitalized" label="Name">{{ props.row.name }}</b-table-column>
                <b-table-column label="Model">{{ props.row.model }}</b-table-column>
                <b-table-column label="Qty">{{ props.row.qty }}</b-table-column>

                <b-table-column label="Action" style="min-width:110px">
                  <div class="buttons has-addons">
                    <b-tooltip
                      :label="props.row.publish != 0 ?'Published':'Unpublish'"
                      size="is-small"
                      type="is-dark"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small"
                        :class="props.row.publish != 0? 'is-success': 'is-danger'"
                        @click="changeStatus(props.row.id)"
                      >
                        <b-icon size="is-small" icon="power" />
                      </span>
                    </b-tooltip>
                    <b-tooltip
                      type="is-dark"
                      label="Edit"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-info"
                        @click.prevent="openEditProductModal(props.row.id)"
                      >
                        <b-icon size="is-small" icon="square-edit-outline" />
                      </span>
                    </b-tooltip>
                    <b-tooltip
                      type="is-dark"
                      label="Delete"
                      size="is-small"
                      position="is-bottom"
                      animated
                    >
                      <span
                        class="button is-small is-danger"
                        @click.prevent="deleteProduct(props.row.id)"
                      >
                        <b-icon size="is-small" icon="delete" />
                      </span>
                    </b-tooltip>
                  </div>
                </b-table-column>
              </template>
            </b-table>
            <div class="is-hidden-tablet is-hidden-desktop">
              <br />
              <p class="has-text-centered has-text-grey">Page {{page}}</p>
            </div>
          </div>
          <div class="column is-12">
            <nav class="pagination" role="navigation" aria-label="pagination">
              <template v-if="!search">
                <b-button
                  class="pagination-previous"
                  icon-right="chevron-left"
                  :disabled="page == 1"
                  @click="previous"
                />
                <b-button
                  class="pagination-next"
                  :disabled="page >= (Math.ceil(count/limit))"
                  icon-right="chevron-right"
                  @click="next"
                />
              </template>
              <ul class="pagination-list">
                <li>
                  <b-button
                    class="pagination-link"
                    type="is-primary "
                    @click="isAddProductModalActive=true"
                    icon-left="plus"
                  >Add New</b-button>
                </li>
                <li>
                  <b-button
                    class="pagination-link"
                    type="is-primary"
                    icon-left="delete"
                    @click.prevent="deleteCheked()"
                  >Delete Checked</b-button>
                </li>
                <li>
                  <b-button class="pagination-link" type="is-primary" icon-left="printer">Print</b-button>
                </li>
              </ul>
              <p class="pagination-list has-text-grey is-hidden-mobile">Page {{page}}</p>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBaseUrl } from "@/localstorage-helper";
import { urlEncoded } from "@/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import swal from "sweetalert";
export default {
  data() {
    return {
      showFilter: false,
      activeIndex: 0,
      currencyList: [],
      manufactureList: [],
      branchList: [],
      checkedRows: [],
      count: 0,
      pageIndex: 1,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      isAddProductModalActive: false,
      isEditProductModalActive: false,
      categoryList: [],
      // Filter
      // branch: "",
      // category: "",
      // brand: "2",
      // color: "",
      // size: "",
      // publish: "",
      // sku: "",
      // limit: 10,
      // AddNewProduct
      file_url: "",
      userfile: null,
      tname: "",
      ccur: "",
      ccategory: "",
      cmanufacture: "",
      tsku: "",
      ctype: "",
      tmodel: "",
      // Edit Product
      activeStep: 0,
      id: null,
      tdesc: "",
      // Step2
      tshortdexc: "",
      tmetatitle: "",
      tmetadesc: "",
      tmetakeywords: "",
      tspec: "",
      // Step3
      tprice: 0,
      tlowprice: 0,
      tdisc_p: 0,
      tdiscount: 0,
      tmin: 0,
      // Step4
      tlength: 0,
      twidth: 0,
      theight: 0,
      cdimension: "",
      tweight: 0,
      ccolor: "",
      csize: 0
    };
  },
  methods: {
    loadBranch() {
      this.axios.get("/branch").then(res => {
        this.branchList = [];
        let branch = res.data.content.result;
        branch.map(el => {
          let elBranch = {};
          elBranch.code = el.code;
          elBranch.name = el.name;
          this.branchList.push(elBranch);
        });
      });
    },
    // Load Category
    loadCategory() {
      this.axios.get("/category").then(res => {
        this.categoryList = [];
        let category = res.data.content.result;
        category.map(el => {
          let elCateogory = {};
          elCateogory.code = el.code;
          elCateogory.name = el.name;
          elCateogory.id = el.id;
          this.categoryList.push(elCateogory);
        });
      });
    },
    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.currencyList = [];
        let currency = res.data.content.result;
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },
    // Load manufacture
    loadManufacture() {
      this.manufactureList = [];
      this.axios.get("/manufacture").then(res => {
        this.manufactureList = [];
        let manufacture = res.data.content.result;
        manufacture.map(el => {
          let manufactureElement = {};
          manufactureElement.id = el.id;
          manufactureElement.name = el.name;
          this.manufactureList.push(manufactureElement);
        });
      });
    },
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
    /*
     * Load async productList
     */
    loadAsyncProductList() {
      let bodyRequest = {
        branch: this.branch,
        category: this.category,
        brand: this.brand,
        color: this.color,
        size: this.size,
        publish: this.publish,
        sku: this.sku,
        limit: this.limit,
        offset: this.offset
      };
      this.loading = true;
      let ajax;
      if (this.search) {
        bodyRequest.filter = this.search;
        ajax = this.axios.post("/product/search", bodyRequest);
      } else {
        ajax = this.axios.post("/product", bodyRequest);
      }
      ajax
        .then(res => {
          let products = res.data.content.result;
          this.count = res.data.content.record;
          if (products) this.$store.commit("products/addProductList", products);
          else this.$store.commit("products/addProductList", []);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    next() {
      this.$store.commit("products/incrementPage");
      this.loadAsyncProductList();
    },
    // Next
    previous() {
      if (this.page > 1) {
        this.$store.commit("products/decrementPage");
        this.loadAsyncProductList();
      }
    },
    // Filter Table
    loadFilter() {
      this.$store.commit("products/filter");
      this.loadAsyncProductList();
    },
    // Publish/unpublish
    changeStatus(id) {
      this.axios.get(`/product/publish/${id}`).then(res => {
        this.loadAsyncProductList();
      });
    },
    // Delete Product
    deleteProduct(id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          this.axios
            .get(`/product/delete/${id}`)
            .then(res => {
              swal("Poof! Your product has been deleted!", {
                icon: "success"
              });
              this.loadAsyncProductList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your product is safe!");
        }
      });
    },
    // Delete Checked Product
    deleteCheked() {
      swal({
        title: "Are you sure?",
        text:
          "Once deleted, you will not be able to recover this product data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          let bodyRequest = {};
          this.checkedRows.map((el, index) => {
            bodyRequest[`cek[${index}]`] = el.id;
          });
          console.log(bodyRequest);
          this.axios
            .post("/product/delete_all", urlEncoded(bodyRequest), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              swal("Poof! Product data has been deleted!", {
                icon: "success"
              });
              this.checkedRows = [];
              this.loadAsyncProductList();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Your product data is safe!");
        }
      });
    },
    // Open Edit Table
    openEditProductModal(id) {
      this.loadCategory();
      this.loadCurrency();
      this.loadManufacture();
      this.loadBranch();
      this.loading = true;
      this.axios.get(`/product/get/${id}`).then(res => {
        let data = res.data.content;
        this.id = id;
        this.tname = data.name;
        this.tsku = data.sku;
        this.ctype = data.type;
        this.tmodel = data.model;
        this.ccur = data.currency;
        this.ccategory = data.category;
        this.cmanufacture = data.manufacture;
        this.permalink = data.permalink;
        this.tdesc = data.desc;
        this.tshortdexc = data.sdesc;
        this.tmetatitle = data.metatitle;
        this.tmetadesc = data.metadesc;
        this.tmetakeywords = data.metakeywords;
        this.tspec = data.spec;
        this.tprice = data.price;
        this.tlowprice = data.lowprice;
        this.tdisc_p = data.disc_p;
        this.tdiscount = data.discount;
        this.tmin = data.min;
        this.tlength = data.length;
        this.twidth = data.width;
        this.theight = data.height;
        this.cdimension = data.dimension;
        this.tweight = data.weight;
        this.ccolor = data.color;
        this.csize = data.size;
        this.file_url = data.image;
        this.isEditProductModalActive = true;
        this.loading = false;
      });
    },
    // Edit Product
    editProduct(event) {
      let productData = new FormData();
      if (this.activeStep === 0) {
        productData.append("userfile", this.userfile);
        productData.append("tname", this.tname);
        productData.append("tsku", this.tsku);
        productData.append("tmodel", this.tmodel);
        productData.append("ccategory", this.ccategory);
        productData.append("ctype", this.ctype);
        productData.append("ccur", this.ccur);
        productData.append("cmanufacture", this.cmanufacture);
      }
      if (this.activeStep === 1) {
        productData.append("tdesc", this.tdesc);
        productData.append("tshortdexc", this.tshortdexc);
        productData.append("tmetatitle", this.tmetatitle);
        productData.append("tmetadesc", this.tmetadesc);
        productData.append("tmetakeyword", this.tmetakeywords);
        productData.append("tspec", this.tspec);
      }
      if (this.activeStep === 2) {
        productData.append("tprice", this.tprice);
        productData.append("tlowprice", this.tlowprice);
        productData.append("tdisc_p", this.tdisc_p);
        productData.append("tdiscount", this.tdiscount);
        productData.append("tmin", this.tmin);
      }
      if (this.activeStep === 3) {
        productData.append("tlength", this.tlength);
        productData.append("twidth", this.twidth);
        productData.append("theight", this.theight);
        productData.append("cdimension", this.cdimension);
        productData.append("tmin", this.tmin);
      }
      console.log(productData);
      this.axios
        .post(
          `/product/update/${this.id}/${this.activeStep + 1}`,
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(res => {
          let err = res.data.error;
          swal("Success!", "Product submit successfully!", "success");
          this.isEditProductModalActive = false;
          this.modalCloseClicked();
          this.loadAsyncProductList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },

    // Add Product
    submitProduct(event) {
      let productData = new FormData();
      productData.append("userfile", this.userfile);
      productData.append("tname", this.tname);
      productData.append("tsku", this.tsku);
      productData.append("tmodel", this.tmodel);
      productData.append("ccategory", this.ccategory);
      productData.append("ctype", this.ctype);
      productData.append("ccur", this.ccur);
      productData.append("cmanufacture", this.cmanufacture);
      this.axios
        .post("/product/add", productData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          let err = res.data.error;
          swal("Success!", "Product submit successfully!", "success");
          this.isAddProductModalActive = false;
          this.loadAsyncProductList();
        })
        .catch(err => {
          let errMessage = err.response.data.error
            .replace(/(<p>)/g, "* ")
            .replace(/(<\/p>)/g, "");
          swal("Failed!", errMessage, "warning");
        });
    },
    reset() {
      this.$store.commit("products/reset");
    },
    modalCloseClicked() {
      this.isAddProductModalActive = false;
      this.isEditProductModalActive = false;
      // AddNewProduct
      this.userfile = null;
      this.file_url = "";
      this.tname = "";
      this.ccur = "";
      this.ccategory = "";
      this.cmanufacture = "";
      this.tsku = "";
      this.ctype = "";
      this.tmodel = "";
      // Edit Product
      (this.activeStep = 0), (this.id = null);
      this.tdesc = "";
      // Step2
      this.tshortdexc = "";
      this.tmetatitle = "";
      this.tmetadesc = "";
      this.tmetakeywords = "";
      this.tspec = "";
      this.this.tprice = 0;
      // Step3
      this.tlowprice = 0;
      this.tdisc_p = 0;
      this.tdiscount = 0;
      this.tmin = 0;
      this.this.tlength = 0;
      // Step4
      this.twidth = 0;
      this.theight = 0;
      this.cdimension = "";
      this.tweight = 0;
      this.ccolor = "";
      this.csize = 0;
    },
    updateSku: debounce(function(event) {
      this.$store.commit("products/updateSku", event);
    }, 200),
    searchProduct: debounce(function(event) {
      this.$store.commit("products/updateSearch", event);
      this.$store.commit("products/reset");
      this.$store.commit("products/filter");
      this.loadAsyncProductList();
    }, 500)
    // console.log(event.target.value)
  },
  computed: {
    ...mapState({
      productList: state => state.products.productList,
      page: state => state.products.page,
      offset: state => state.products.offset,
      sku: state => state.products.filter.sku,
      search: state => state.products.filter.search
    })
  },
  created() {
    if (!this.productList.length) this.loadAsyncProductList();
    this.loadBranch();
    this.loadCategory();
  }
};
</script>
<style>
.padding-card {
  padding: 0.75rem 0.2rem;
  background: linear-gradient(to right, rgb(121, 86, 236), rgb(47, 185, 248));
  box-shadow: none;
  color: white;
}
.shortcut .column {
  padding: 0.75rem 0.25rem;
}
</style>



