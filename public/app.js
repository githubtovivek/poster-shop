setTimeout(function() {
	var LOAD_NUM = 4;
	var watcher;

	new Vue({
		el: "#app",
		data: {
			total: 0,
			products: [],
			cart: [],
			searchTerm: "cat",
			LastSearchTerm: "",
			loading: false,
			results: []
		},
		methods: {
			addToCart: function(product) {
				this.total += product.price;
				var found = false;

				for (var i = 0; i < this.cart.length; i++) {
					if (this.cart[i].id === product.id) {
						this.cart[i].qty++;
						found = true;
					}
				}

				if (!found) {
					this.cart.push({
						id: product.id,
						price: product.price,
						title: product.title,
						qty: 1
					});
				}
			},
			increaseItem: function(item) {
				item.qty++;
				this.total += item.price;
			},
			decreaseItem: function(item) {
				item.qty--;
				this.total -= item.price;

				if (item.qty <= 0) {
					this.cart.splice(this.cart.indexOf(item), 1);
				}
			},
			onSubmit: function() {
				this.fetchSearchResult();
			},
			fetchSearchResult: function(path) {
				this.products = [];
				this.results = [];
				this.loading = true;
				var path = "/search?q=".concat(this.searchTerm);

				this.$http.get(path).then(function(response) {
					setTimeout(
						function() {
							this.results = response.body;
							this.LastSearchTerm = this.searchTerm;
							this.appenedResults();
							this.loading = false;
						}.bind(this),
						3000
					);
				});
			},
			appenedResults: function() {
				if (this.products.length < this.results.length) {
					var totalRenderedProducts = this.products.length;
					var toAppenedResults = this.results.slice(
						totalRenderedProducts,
						LOAD_NUM + totalRenderedProducts
					);

					this.products = this.products.concat(toAppenedResults);
				}
			}
		},
		filters: {
			currency: function(price) {
				return "£".concat(price.toFixed(2));
			}
		},
		created: function() {
			this.fetchSearchResult();
		},
		updated: function() {
			var sensor = document.querySelector("#product-list-bottom");

			watcher = scrollMonitor.create(sensor);

			watcher.enterViewport(this.appenedResults);
		},
		updateBefore: function() {
			if (watcher) {
				watcher.destroy();
			}
		}
	});
}, 4000);
