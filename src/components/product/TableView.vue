<template>
  <div class="container">
    <div class="row d-flex align-items-center">
      <div class="col-md-12">
        <h3 class="">Filter</h3>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label for="category">Category</label>
          <select
            class="form-control"
            id="category"
            v-model="selectedCategory"
            @change="applyFilter"
          >
            <option value="" selected>All</option>
            <option v-for="category in categoriesData" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <button class="btn btn-success" @click="exportCSV">Export CSV</button>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">
            <span type="button" @click="orderBy('title')">
              Product Name
              <i
                v-if="orderByField === 'title'"
                :class="`fa fa-sort-${orderByDirection}`"
              ></i>
              <i v-else :class="`fa fa-sort-asc`"></i>
            </span>
          </th>
          <th scope="col">
            <span type="button" @click="orderBy('price')"
              >Price
              <i
                v-if="orderByField === 'price'"
                :class="`fa fa-sort-${orderByDirection}`"
              ></i>
              <i v-else :class="`fa fa-sort-asc`"></i
            ></span>
          </th>
          <th scope="col">
            <span type="button" @click="orderBy('category')"
              >Category
              <i
                v-if="orderByField === 'category'"
                :class="`fa fa-sort-${orderByDirection}`"
              ></i>
              <i v-else :class="`fa fa-sort-asc`"></i
            ></span>
          </th>
          <th scope="col"><span>Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="productData.length === 0">
          <td colspan="5" class="text-center">No products found</td>
        </tr>
        <tr v-for="(product, index) in paginatedProducts" :key="product.id">
          <td>{{ (currentPage - 1) * productsPerPage + index + 1 }}</td>
          <td class="col-md-4" scope="row">{{ product.title }}</td>
          <td>
            <span class="badge bg-dark text-warning rounded-full"
              >{{ product.price }} <i class="fa fa-usd"></i
            ></span>
          </td>
          <td>
            <span class="badge bg-primary">{{ product.category }} </span>
          </td>
          <td>
            <button
              class="btn btn-danger"
              @click="openConfirmationModal(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-between">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Total Price: {{ totalPrice }}</h5>
        </div>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="previousPage">Previous</button>
          </li>
          <li
            v-for="page in pages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="nextPage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <ConfirmModal
    :show="showModal"
    :confirmMessage="confirmMessage"
    :id="selectedId"
    @cancel="handleCancel"
    @confirm="deleteProductByIds"
  >
  </ConfirmModal>
</template>
<script src="@/assets/js/product/list.js"></script>
