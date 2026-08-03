        // Fallback default dataset array structure 
        const defaultCatalog = [
            { name: "Gomesi", hirePrice: "30,000", buyPrice: "200,000" },
            { name: "Kanzu", hirePrice: "20,000", buyPrice: "70,000" },
            { name: "Suits", hirePrice: "80,000", buyPrice: "250,000" },
            { name: "Wedding Gown", hirePrice: "250,000", buyPrice: "1,000,000" },
            { name: "Bridal Gomesi", hirePrice: "100,000", buyPrice: "800,000" },
            { name: "Mushanana", hirePrice: "25,000", buyPrice: "100,000" },
            { name: "Groom's Suit", hirePrice: "100,000", buyPrice: "300,000" }
        ];

        // Extend loadDashboardData to refresh catalog settings
        const originalLoadDashboardData = loadDashboardData;
        loadDashboardData = function() {
            originalLoadDashboardData();
            loadAdminCatalog();
        };

        function loadAdminCatalog() {
            const tbody = document.getElementById('adminCatalogBody');
            tbody.innerHTML = "";
            
            let catalog = JSON.parse(localStorage.getItem('urembo_catalog')) || defaultCatalog;
            
            catalog.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(item.name)}</strong></td>
                    <td>UGX ${escapeHtml(item.hirePrice)}</td>
                    <td>UGX ${escapeHtml(item.buyPrice)}</td>
                    <td style="text-align: right;">
                        <button class="btn-dash clear-btn" style="padding: 5px 10px; font-size: 0.75rem; margin-right: 5px;" onclick="editCatalogItem(${index})">Edit</button>
                        <button class="btn-dash logout-btn" style="padding: 5px 10px; font-size: 0.75rem;" onclick="deleteCatalogItem(${index})">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function saveCatalogItem() {
            const name = document.getElementById('itemName').value.trim();
            const hirePrice = document.getElementById('itemHire').value.trim();
            const buyPrice = document.getElementById('itemBuy').value.trim();

            if(!name || !hirePrice || !buyPrice) {
                alert("Please fill out all pricing variables before submitting changes.");
                return;
            }

            let catalog = JSON.parse(localStorage.getItem('urembo_catalog')) || defaultCatalog;
            
            // Check if item already exists to update it, otherwise create new record
            const existingIndex = catalog.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
            if(existingIndex > -1) {
                catalog[existingIndex] = { name, hirePrice, buyPrice };
            } else {
                catalog.push({ name, hirePrice, buyPrice });
            }

            localStorage.setItem('urembo_catalog', JSON.stringify(catalog));
            loadAdminCatalog();
            
            // Reset input values smoothly
            document.getElementById('itemName').value = "";
            document.getElementById('itemHire').value = "";
            document.getElementById('itemBuy').value = "";
        }

        function editCatalogItem(index) {
            let catalog = JSON.parse(localStorage.getItem('urembo_catalog')) || defaultCatalog;
            const item = catalog[index];
            
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemHire').value = item.hirePrice;
            document.getElementById('itemBuy').value = item.buyPrice;
        }

        function deleteCatalogItem(index) {
            if(confirm("Remove this attire item entirely from public home pages?")) {
                let catalog = JSON.parse(localStorage.getItem('urembo_catalog')) || defaultCatalog;
                catalog.splice(index, 1);
                localStorage.setItem('urembo_catalog', JSON.stringify(catalog));
                loadAdminCatalog();
            }
        }
