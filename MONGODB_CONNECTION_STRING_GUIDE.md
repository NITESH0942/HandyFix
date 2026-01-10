# 🔗 MongoDB Connection String Setup for Render

## 📋 Your MongoDB Atlas Connection String

From the MongoDB Atlas dialog, you have:
```
mongodb+srv://NITESH0942:<db_password>@cluster0.sgbibbg.mongodb.net/?appName=Cluster0
```

## ✅ Step-by-Step: Format for Render

### Step 1: Replace `<db_password>`
Replace `<db_password>` with your actual database password.

**Example:** If your password is `MyPassword123`, it becomes:
```
mongodb+srv://NITESH0942:MyPassword123@cluster0.sgbibbg.mongodb.net/?appName=Cluster0
```

### Step 2: Add Database Name
Add your database name after the host and before the `?`.

**Format:**
```
mongodb+srv://NITESH0942:<password>@cluster0.sgbibbg.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Example with database name `homeservice`:**
```
mongodb+srv://NITESH0942:MyPassword123@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
```

### Step 3: URL Encode Special Characters (If Needed)

If your password contains special characters, URL encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `/` becomes `%2F`
- `?` becomes `%3F`
- `=` becomes `%3D`

**Example:** Password `P@ssw0rd#123` becomes `P%40ssw0rd%23123`

### Step 4: Final Format for Render

Your final `MONGODB_URI` should look like:
```
mongodb+srv://NITESH0942:YOUR_PASSWORD@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
```

## 🔧 Add to Render Dashboard

1. Go to Render Dashboard → Your Service → **Environment**
2. Click **"Add Environment Variable"**
3. Set:
   - **Key:** `MONGODB_URI`
   - **Value:** Your formatted connection string (from Step 3)
4. Click **"Save Changes"**
5. Render will automatically restart your service

## ✅ Complete Example

If your:
- **Username:** `NITESH0942`
- **Password:** `MySecurePass123`
- **Database Name:** `homeservice`

Then your `MONGODB_URI` in Render should be:
```
mongodb+srv://NITESH0942:MySecurePass123@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
```

## 📝 Quick Checklist

- [ ] Replace `<db_password>` with actual password
- [ ] Add database name (e.g., `/homeservice`)
- [ ] Add connection options: `?retryWrites=true&w=majority`
- [ ] URL encode special characters in password (if any)
- [ ] Copy complete string to Render environment variables
- [ ] Save changes in Render

## 🆘 Troubleshooting

**Connection fails?**
- Verify password is correct
- Check MongoDB Atlas → Network Access → IP `0.0.0.0/0` is allowed
- Verify database name exists
- Check password special characters are URL encoded

**Authentication failed?**
- Double-check username: `NITESH0942`
- Verify password is correct (case-sensitive)
- Make sure database user has read/write permissions

**Still having issues?**
- Test connection string locally first
- Check MongoDB Atlas logs
- Verify cluster is running and accessible

---

**Your connection string format:**
```
mongodb+srv://NITESH0942:YOUR_PASSWORD@cluster0.sgbibbg.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD` → Your actual password
- `DATABASE_NAME` → Your database name (e.g., `homeservice`)

