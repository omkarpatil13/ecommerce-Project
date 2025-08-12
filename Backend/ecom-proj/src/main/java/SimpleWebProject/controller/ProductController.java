package SimpleWebProject.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import SimpleWebProject.model.Product;
import SimpleWebProject.service.ProductService;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
@RequestMapping("/api")
public class ProductController {
	
	@Autowired
	ProductService pservice;
	@GetMapping("/products")
	public ResponseEntity<List<Product>>getAllProduct()
	{
		return new ResponseEntity<>(pservice.getAllProducts(),HttpStatus.OK);
	}
	
	@GetMapping("/product/{id}")
	public ResponseEntity<Product> getProduct(@PathVariable int id)
	{
		return new ResponseEntity<>(pservice.getProductById(id),HttpStatus.OK);
	}
	
	@PostMapping("/product")
	public ResponseEntity<?> addProduct(
	    @RequestPart("product") Product product,
	    @RequestPart("imageFile") MultipartFile imageFile
	) {
	    try {
	        Product saved = pservice.addProduct(product, imageFile);
	        return new ResponseEntity<>(saved, HttpStatus.CREATED);
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@GetMapping("/product/{id}/image")
	public ResponseEntity<byte[]> getImage(@PathVariable int id) {
	    byte[] imageData = pservice.getImageByProductId(id); // implement this
	    return ResponseEntity
	            .ok()
	            .contentType(MediaType.IMAGE_JPEG) // or IMAGE_PNG
	            .body(imageData);
	}
	
	@PutMapping("/product/{id}")
	public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile)
	{
		Product product1;
		try {
			product1 = pservice.updateProduct(id,product,imageFile);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ResponseEntity<>("Failed to update",HttpStatus.BAD_REQUEST);
		}
		if(product1!=null)
		{
			return new ResponseEntity<>("Updated",HttpStatus.OK);
		}
		else
			return new ResponseEntity<>("Failed to update",HttpStatus.BAD_REQUEST);
	}
	
	@DeleteMapping("/product/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable int id)
	
	{
		Product product2 =pservice.getProductById(id);
		if(product2 !=null)
		{
		pservice.deleteProduct(id);
		return new ResponseEntity<>("deleted",HttpStatus.OK);
		}
		else
		return new ResponseEntity<>("Product not found",HttpStatus.NOT_FOUND);
		
		
	}
	@GetMapping("/products/search")
	public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
	    System.out.println("Searching with: " + keyword);
	    List<Product> products = pservice.searchProducts(keyword);
	    return new ResponseEntity<>(products, HttpStatus.OK);
	}


	
}
