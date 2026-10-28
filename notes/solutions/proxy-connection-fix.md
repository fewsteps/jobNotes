# Fix: Corporate Proxy Connection Issue

**Problem:** Browser shows `ERR_CONNECTION_REFUSED` on internal tools
**Environment:** Windows, Corporate Network

---

## Symptoms

- Internal web apps fail to load
- Error code: `ERR_CONNECTION_REFUSED`

## Root Cause

Proxy settings inherited from Internet Explorer were misconfigured.

## Solution

```
1. Open: Control Panel → Internet Options → Connections → LAN Settings
2. Check "Use a proxy server"
3. Enter correct proxy address (get from IT)
4. Click OK and restart browser
```

## Alternative (PowerShell, no admin needed)

```powershell
netsh winhttp show proxy
netsh winhttp import proxy source=ie
```

**Status:** ✅ Resolved

---
*Tags: network, proxy, browser, windows*
