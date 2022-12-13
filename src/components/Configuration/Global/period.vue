<template>
  <div>
    <form class="flat-card">
      <div class="card-content">

        <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
        <p class="modal-card-title">Management Period</p>
        <hr />
        
        <b-field label="Account Name">
          <b-input v-model="name" />
        </b-field>
        <b-field label="Account No">
          <b-input v-model="no" />
        </b-field>
        <b-field label="Bank Details">
          <b-input v-model="details" />
        </b-field>
        <br />
        <p class="has-text-right">
          <button class="button is-primary" @click.prevent="submitCashin()">Save</button>
          <button class="button is-warning" type="button" @click.prevent="reset(event)">Reset</button>
        </p>
      </div>
    </form>
  </div>
</template>