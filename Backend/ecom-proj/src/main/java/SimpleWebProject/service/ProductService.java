package SimpleWebProject.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import SimpleWebProject.model.Product;
import SimpleWebProject.repository.ProductRepo;

@Service
public class ProductService {
	@Autowired
	private ProductRepo repo;

	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return repo.findAll();
	}


	public Product getProductById(int id) {
		// TODO Auto-generated method stub
		return repo.findById(id).orElse(new Product());
	}


	public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
		// TODO Auto-generated method stub
		product.setImagename(imageFile.getOriginalFilename());
		product.setImageType(imageFile.getContentType());
		product.setImageData(imageFile.getBytes());
		return repo.save(product);
	}

	public byte[] getImageByProductId(int id) {
	    return repo.findById(id)
	               .map(Product::getImageData)
	               .orElse(null);
	}


	public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
		// TODO Auto-generated method stub
		product.setImageData(imageFile.getBytes());
		product.setImagename(imageFile.getOriginalFilename());
		product.setImageType(imageFile.getContentType());
		return repo.save(product);
	}


	public void deleteProduct(int id) {
		// TODO Auto-generated method stub
		repo.deleteById(id);
		
	}


	public List<Product> searchProducts(String keyword) {
	    return repo.searchProduct(keyword);
	}


	


	
}
