package org.cenoteando.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.cenoteando.models.Reference;
import org.cenoteando.services.ReferenceService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController()
@RequestMapping("/api/references")
public class ReferenceController {

    private final ReferenceService referenceService;

    public ReferenceController(ReferenceService referenceService) {
        this.referenceService = referenceService;
    }


    @GetMapping()
    public Iterable<Reference> getReferences(){
        Iterable<Reference> references = referenceService.getReferences();
        return references;
    }

    @GetMapping("/{id}")
    public Reference getReference(@PathVariable String id){
        return (Reference) referenceService.getReference(id);
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Reference createReference(@RequestBody Reference reference) throws Exception {
        return referenceService.createReference(reference);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Reference updateReference(@PathVariable String id, @RequestBody Reference reference) throws Exception {
        return referenceService.updateReference(id,reference);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String deleteReference(@PathVariable String id) throws Exception {
        referenceService.deleteReference(id);
        return "no content";
    }


    @GetMapping("/csv")
    public String toCsv(HttpServletResponse response) throws IOException, IllegalAccessException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=references.csv");

        return referenceService.toCsv();
    }

    @PutMapping("/csv")
    public List<String> fromCsv(@RequestParam("file") MultipartFile multipartfile) throws Exception {
        return referenceService.fromCsv(multipartfile);
    }


}
