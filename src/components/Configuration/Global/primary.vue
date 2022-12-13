<template>
  <div>
    <form class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">Primary Details</p>
        <hr />
        <b-field grouped group-multiline>
          <b-field label="Company Name">
            <b-input v-model="name" expanded/>
          </b-field>
          <b-field label="City" expanded>
            <b-select expanded placeholder="Select City" v-model="city">
              <option
                v-for="currency in currencyList"
                :value="currency.code"
                :key="currency.id"
              >{{currency.code}}</option>
            </b-select>
          </b-field>
        </b-field>  
          <b-field label="Address" expanded>
            <b-input v-model="address" type="textarea" expanded />
          </b-field>


        <b-field grouped group-multiline>
         
           <b-field label="Zip Code" expanded>
            <b-input v-model="zip" />
          </b-field>  
          <b-field label="Phone" expanded>
            <b-input v-model="phone" />
          </b-field>
          <b-field label="Email" expanded>
            <b-input type="email" v-model="email" />
          </b-field>
        </b-field>

          

        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitCashin()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
      </div>
    </form>
  </div>
</template>