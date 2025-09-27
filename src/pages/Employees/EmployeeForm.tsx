@@ .. @@
                 />
               )}
             />
           </Grid>
+          <Grid item xs={12} md={6}>
+            <Controller
+              name="branchId"
+              control={control}
+              render={({ field }) => (
+                <FormControl fullWidth error={!!errors.branchId}>
+                  <InputLabel>Branch Assignment</InputLabel>
+                  <Select {...field} label="Branch Assignment">
+                    {branches.map((branch) => (
+                      <MenuItem key={branch.id} value={branch.id}>
+                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
+                          <LocationOn fontSize="small" />
+                          {branch.name} ({branch.code})
+                        </Box>
+                      </MenuItem>
+                    ))}
+                  </Select>
+                  {errors.branchId && (
+                    <Typography variant="caption" color="error">
+                      {errors.branchId.message}
+                    </Typography>
+                  )}
+                </FormControl>
+              )}
+            />
+          </Grid>
           <Grid item xs={12} md={6}>
             <Controller
               name="department"