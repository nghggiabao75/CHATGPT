const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ChatGPTAPIAutomation {
  constructor() {
    this.baseURL = 'https://chatgpt.com/backend-api';
    this.resultsFile = 'eligible_codes.txt';
    this.headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'authorization': process.env.AUTHORIZATION_TOKEN || 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MzQ0ZTY1LWJiYzktNDRkMS1hOWQwLWY5NTdiMDc5YmQwZSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSJdLCJjbGllbnRfaWQiOiJhcHBfWDh6WTZ2VzJwUTl0UjNkRTduSzFqTDVnSCIsImV4cCI6MTc2MTQ0NDUzNSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7ImNoYXRncHRfY29tcHV0ZV9yZXNpZGVuY3kiOiJub19jb25zdHJhaW50IiwiY2hhdGdwdF9kYXRhX3Jlc2lkZW5jeSI6Im5vX2NvbnN0cmFpbnQiLCJ1c2VyX2lkIjoidXNlci1VRmp1dDJseXBtTkdKbGVWUzFQNEhYVnoifSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9wcm9maWxlIjp7ImVtYWlsIjoiYmFvbmdoZzI2MDZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJpYXQiOjE3NjA1ODA1MzQsImlzcyI6Imh0dHBzOi8vYXV0aC5vcGVuYWkuY29tIiwianRpIjoiNmU4NTA2ZDgtZmVkYS00Yzc0LTgwMTQtZWQ3Y2Y3OThiNmI5IiwibmJmIjoxNzYwNTgwNTM0LCJwd2RfYXV0aF90aW1lIjoxNzYwNTgwNTMzMjY3LCJzY3AiOlsib3BlbmlkIiwiZW1haWwiLCJwcm9maWxlIiwib2ZmbGluZV9hY2Nlc3MiLCJtb2RlbC5yZXF1ZXN0IiwibW9kZWwucmVhZCIsIm9yZ2FuaXphdGlvbi5yZWFkIiwib3JnYW5pemF0aW9uLndyaXRlIl0sInNlc3Npb25faWQiOiJhdXRoc2Vzc185aFVOdkZLSGt1YlFxcFFmRGdzQjNIRGIiLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNzU0ODQ5MjA5NzgxMjc5Mzk4NiJ9.boKQ_Bt1BhJKuYi39TkoQyfTtiUWy8Z2hwudHmB8Y0js1xJ5lrW5zIBXuk3bB6UJXoeE3YUIJUSYol_3FSfUt2CqKlA8lQtOZE4S3oHwKnO5gl1iYIBQdU9BNkhKNmm5vXhUTvWaGiEbEoJLQJDRJgnn7GTD6DRYR6qshOXQAKvP_7HmtCS5DxgW0AAGyZiz3qQBFKmC6iMorcioDhNXzNNfE9i2whWbX_uE0LkN3pzjd2Vey3pK1o-fiS9MYkZnqAq3OyPy6Nhwy4RK5XQhyf-G6GGxbKOPe8RkM6xDJnd_vCpylG2DaXv7_5g-6JWyFCJq1i0kLd8-_aLBZbg4w-0Z9LhzpheY6eP4Hg7KdaUIdXPea4xodmw_BTbVDipaRLO0KyjvEg4mTIUbcdIg_wQQ-Ev7QRC7XNHcljg5sskIfmLlw0nU5y8u9FPSFlGyZ_Ml5qrfwLh6CclkaDFAZ6UKgmW_aAGm_RmnwwHOWmBCfBFs2PUDAoZPTEorajMLaUaUZjD8wyUAfX-1kvLfmnzLr2uYFOTXcuLbnH1tb83_Cjl3eOaRzOfSvzue2TTlark73TQzAhKMKK0_hOFvQstjbT7UzRdc7fY66cuV71c1mneCKiohRxx5NdwTnkDOVA4fpe85jc4cpSqwIJtiRzS3bTJe0vURA4NdU2CejzU',
      'oai-client-version': 'prod-44879fb73ee0ef66239f7e0c0ff9a8895a0b6de0',
      'oai-device-id': process.env.OAI_DEVICE_ID || '4163a0d3-15cc-4768-8d1a-168eae9eba66',
      'oai-language': 'en-US',
      'priority': 'u=1, i',
      'sec-ch-ua': '"Microsoft Edge";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0'
    };
    
    this.cookies = process.env.COOKIES || '__Host-next-auth.csrf-token=d721eedf8f28ac5e0c439e96a335db0ddbce7b08317f0943d2eca9b4efd73fbf%7C512f32e14ee298963cac4fd4725976b0e1c9dc5f8e50e4d307b1a429aab38971; oai-did=4163a0d3-15cc-4768-8d1a-168eae9eba66; __cflb=0H28vzvP5FJafnkHxihKb44bdy6fTJD3K3uxRKVyBij; _cfuvid=BJWttm0k.bT5HlBxzyXXa5N4EsxNS1Pis8joXr.awSs-1760580471573-0.0.1.1-604800000; _ga=GA1.1.992754988.1760580473; __Secure-next-auth.callback-url=https%3A%2F%2Fchatgpt.com%2F; oai-hlib=true; _gcl_au=1.1.1434411118.1760580547; __cf_bm=dQMOFGlwfUJzmb91Hg8oe1Ik8UWMfPMRAuhH5Td4Dls-1760584021-1.0.1.1-Sqt0sfzhDwugRJykgWvLYETm_qKHk81uM5jK3LcY6vsDieqfyxMSBv2J9EgGX0iTUI6Se6YO4UYG.W21RrZpxSsBkZPQQo5b0mhrzvR_vmA; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..1DFlUHecgt-jwcIl.BVrnFDVDFyx-AVD9_-RZ4qzI8ugEG6W0fRpUwLJfltyx-mV6bmbIbDGzg-cSDoQH7qv_hbb5q4rz3fAGZqsKwQQ_MKhxxTJyY01JkbSDz_bs4oFujRfnoXxtW_uKJmiOZrr0WjpHIFckGqZAmGxdHEntZoI4sm4BuO7LiV2IUaEAG3AMmiUu_rAxwKcEjW3eHDrIVp7WzamUXM6FnZbK2FHJ4FQ75mxY_2XVkGPScaP9-KPvQgjgQgGHxhz38hajtcDZHvXBrcFTL0ACO_b-W4YZOoy9pzPwtY9QQrF3WUPRmaS3TxY4vrcJ3l89YXakD3IeeJ5ToRs-CXy9y55MbUyEr1gAlDZRjjoXdP0ygkdvyUrCOfSi4r_U4wmV6UxXuj5eRymysBkXXs6rbdvXKVUpXYnDPXUO0bktaKImKpp2KO7rk96JCE2sZZGmjmQ9vP2nDc8cmQzhBQKIbeeHg_tMZSmJ-sIPiNWKWBCNsuTX6QDPk-g1_SkrBT-n4OgxCS97vJMrJb5SLhTCaRJqq9PLZ-RIskKWJiyjhaAEUmOJVVl8jTGOZwXWFJ8zmfNHIK1al-oNfbIjVjMvLpN0faa7UzDmR2gjRVesiEJ6esAQdVnfZGuw08TQuMkSGKNWK1f29Ic7vmSp8mrQaF1x0OLbm77P4g--Z2hhj3LGkgi9Oix_Pau8KKuAGei9TdS5bN4cfbdtPILnGacUSWtxqtJGEqy-jfrm3JvukjARnKA449bHuw1in7wk87DtGVU7wIN-j8w0JoDY8UyK5Zph_ItWs0UG0FJLrljx6whzI6aEgqIeUtv4GUouMAwrUbYhF7FvBs6hNLwcnrJ80UBJBHP9cMeEh4hV-ed5kMKhVgwuVm57fOb6HoCuUTnUBAt3inh5GB-aeO90jeiNtrZZyucWkdW2UbHsZswMyI85mUTyICIH-DBfKlfN4e6n7FO7-2FAQLPNDh1xQ8wvS7jwysrU5B3sj9feDNdokHrQVtKgYixqR8NXwYYdxm2LEmM624kb067kUvRJKkq4qHVn32Zv_31gKwPLGCYCw6mO9v0BiTHBAi5UdnoFFQqn9Ox1_O_XHSJyKoqlqFQsdJljpZeqQ4wMvBpwW64E-V0MpUki2ENvhVrIYDbFs9qtuNjL0gStVp9GVwWUNsXex2ByDYaOiBIrlqtCCUMV-iNFbmzA1gMIuZ1kECX2JWI5tRBmS8VjjcI0tto4RTKV5RiB-8qdMoiZABZ2wfYnE_JYxneIFtLztgd2ekp0_5ffHD5LM5XDE5gHqetMyVUCZ7N187Dys1gFU1MlmtFeOfe3-KMNizasEYUNkWM4qMz1hAZJtYrZ_bNlsuCteQTgeSzBRLT6j-AooL9R0UqlWXczIDM_bbSZAxxbLdrlJ2mrkFTLUJorS3aG1mSKTYw_p7ksJTh-qKL0blO2lsbBmqvEUYnuJVdUhWK7cKbZoEjv88MedRELGz2yhVgM8ND2Woav4gJGfRu_hAGu0RtIGPvmM6tC3DU7nvxDDjrWOW9CkF17235L6_Mv7y7bhqk0N0lb4e_j7KG4EllxOraqV-WAJRXSkyK_aPpLTx4fVjoPSzU2NLHySvdf10jKKcGdXoZPGZuUYc7yQST8r3Ug70lehtOJSOMEmmysgVFo-XVj-qwybD0da9tbgqME3LXjDDImbbI8d_N5CAv_1OQCyS5ji1WR0pmybHA14Now7UZHMdeyfZD6s9U25YrQ_y0Jk-F0LVlWD45dnJdM_s9pekE1zZ6fAo7TIQf-ICQY7cHlHlJlvvy7DAmq2jy27qNYQ2GhhfTUSBdGk_X3Sh6gmHReVFvUTatcLh6XkH4K2wN9ryQA3lHtYXnZvbVmCWZG_0sz4da7Nm7xH3ml3Qb57VrZUSNzFMPYcm3c3-4IU4RMMLw8tdGgk5xSN1FST2U6ZWI63m3S-lyhUfvKAP5eCoebWwGLjIopV74HwyEDce2Nuy9LX7RuxS0990-3I1dwls1soroQYgPaxUlZiWBFDLiT454IkNnUJviYJBPlrJIzb2EayEB0tuoJ65fvWgi647uR5vfLrHTb06B9q3CP4OALOm_3X9ysXLtHhJUHVR0a9jO1m1FbXyqTBVW7zHHCZKUmY0zQxjAjZ60p8B0Acnf4h3PKSiweWA8X_bqffk1HgwOxmgw0maL25_aFOTo-4mW9UjHQl2SJOOmgj0UZQBql-kwO6aE98GCPv6jLW1Kzv-FkuzuRBztdtCwkpDitaWY8eC2O4e5wyX60paIellWGWRhpeWL8dA1ah-kP1psYYy0IfksSPR1EMHuPqL5-biguvee5hvlXcj4I6YoLs_RrrxxH7Dl8ESa6-71858-g-DtT40ji_3N_wEbS6vfH4h0Q3k3ZLMC4GKRqSFNjEPNygNnwl6312t59SQEqynF9cHgWfNbXrLEX-3q1evj0PRda5wSpNxumjJCcQjTbjgYKsJEk1DUYQYMY9LVoEpho3m4kyHjlj2AzDTOPrXaq1qW40lSiJUdCbt5KZRoZnF02s19RWrCKAO7MdAWXO7p5UvivcO2mVLnKEnPC5jdtdg9ZtkO-jcDyX_1-Qd4o5kYWZddbcgCTUjZ1sSHrUV9wQTqFp62n-icWW5lL_ytxc4pffmDf9MkXEGsJr6lU39gkq49sym9EKBdF7JUYxJdUz2hvEjMuk8XptCYC2I8BjExTpgUORcNEozpmZbAD9sRtbpvEmtDnj06sgI2uqHzHcySWFa_bFr_ghEZZ750koQSFFUCNsyxg4JzdNJIP8b4euIzpjvMnULU9iQU2LLpfJcbozxbrPsoWIYseR_WrwYNRZRhpU5lI8TJjZpD7yBhGQkmOeGFxzI4W3kt5IjE2h2_CLSkTM48AMIm6nX07lYt8a-q8HR30V5_cr73efH0AumLcHRoON8QkGqxHTPaE6tCORxLUzJgPiSs8jHwpRszaHAdFxtQ3VDruUeaVXD4-vrF8pjr48f_LqWjFrOuHWF7bD2glqyDLQiU3dCYDUJrsZCs31uFZnomvlJCLawCKk7SPZjfJZ-tg_hB4DCQ0W2jsprurG2NANNGVlMmxozmpT63At4cCmEdfbVoNqhtld3wO4t9CCZLAxpKS7GIBt7LNG7W5igz81VxWWQ.VSShSCjScgIvAsOTMr7O8Q; _dd_s=aid=55901be6-4a55-4e70-a85f-6a9eb036045d&rum=0&expire=1760584922952&logs=1&id=8472c0b3-2903-412e-bf03-fe7e9d01e08d&created=1760584022951; cf_clearance=7MOFxwFn7BpLP.U6PUPW.AK1qfGjkw03XYV1_pBvwaI-1760584023-1.2.1.1-Okg1ST6v5M6V61zErL41u8lV2rCkl28wnedCwJOs0C9inRh1YsJn_YDxS7AzUzWy314FfGO3nRaka1RmG.hh7O0iuK5tfkY_y.6kFaiXm_FsWX_CtYGDr6TocuzqrF5Xe6_m8ZclR8ANedkmqk4M.3eepqm5ugwMYeQK4oW4ufG7gJjsRE796cntI7mTfYzCTi3MsVW4YbHHrkPiGsDwT72DCzAhMGhV5VWF784rDYg; oai-sc=0gAAAAABo8GFXu0utSX1NDlwpghaCzKBDFzSHV_R69dMSadaV3zjopGns8pVMbO6ouQBeymakN9DW7Nyl4aBdxIzInZ6dYK2QR0gx6Bg1GbYeccmBd34s9Lxg9bBv4KWyyOx6uDMafoNMj8cydEoBx4XnhBgIxWd_943rTtheHjPyz8FVJ20Smjx9cUwneNiGEIkJnyfsWJs9p1U381Xzz6DUa6uym2U2mU9EyB6Q34ZH0JYwyRxm9nw; oai-gn=; oai-hm=WHAT_ARE_YOU_WORKING_ON%20%7C%20READY_WHEN_YOU_ARE; _ga_9SHBSK2D9J=GS2.1.s1760584022$o2$g1$t1760584023$j59$l0$h0';
  }

  /**
   * Generate random promo code based on pattern
   * Pattern: 26 characters - uppercase letters and numbers
   * @returns {string} Generated promo code
   */
  generatePromoCode(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  /**
   * Save eligible code to file
   * @param {string} promoCode - The eligible promo code
   */
  saveEligibleCode(promoCode) {
    try {
      const timestamp = new Date().toISOString();
      const line = `${promoCode} - ${timestamp}\n`;
      fs.appendFileSync(this.resultsFile, line, 'utf8');
      console.log(`✅ Saved eligible code: ${promoCode}`);
    } catch (error) {
      console.error(`❌ Error saving code to file:`, error.message);
    }
  }

  /**
   * Get promotion metadata by promo code
   * @param {string} promoCode - The promotion code
   * @returns {Promise<Object>} API response
   */
  async getPromotionMetadata(promoCode) {
    try {
      const url = `${this.baseURL}/promotions/metadata/${promoCode}`;

      const config = {
        method: 'GET',
        url: url,
        headers: {
          ...this.headers,
          'Cookie': this.cookies,
          'referer': `https://chatgpt.com/?promoCode=${promoCode}`
        },
        timeout: 10000
      };

      const response = await axios(config);

      return {
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers,
        promoCode: promoCode
      };

    } catch (error) {
      // Check if it's a Cloudflare challenge
      if (error.response?.status === 403 || error.response?.data?.includes?.('challenge-platform')) {
        return {
          success: false,
          status: 403,
          error: 'Cloudflare Challenge - Token/Cookies may be expired',
          promoCode: promoCode,
          needsUpdate: true
        };
      }

      return {
        success: false,
        status: error.response?.status || null,
        error: error.response?.data || error.message,
        promoCode: promoCode
      };
    }
  }

  /**
   * Check if response indicates eligible status
   * @param {Object} response - API response
   * @returns {boolean} True if is_eligible is true
   */
  isEligible(response) {
    console.log("response", response);

    return response.data && response.data.is_eligible === true;
  }

  /**
   * Update authorization token
   * @param {string} token - New authorization token
   */
  updateAuthToken(token) {
    this.headers.authorization = `Bearer ${token}`;
    console.log('🔑 Authorization token updated');
  }

  /**
   * Update cookies
   * @param {string} cookies - New cookies string
   */
  updateCookies(cookies) {
    this.cookies = cookies;
    console.log('🍪 Cookies updated');
  }

  /**
   * Update device ID
   * @param {string} deviceId - New device ID
   */
  updateDeviceId(deviceId) {
    this.headers['oai-device-id'] = deviceId;
    console.log('📱 Device ID updated');
  }
}

// Main execution with multi-threading support
async function main() {
  const automation = new ChatGPTAPIAutomation();

  // Number of concurrent requests
  const concurrentRequests = parseInt(process.env.CONCURRENT_REQUESTS || '100');
  // Total number of codes to test
  const totalCodes = parseInt(process.env.TOTAL_CODES || '1000000');

  console.log('🤖 ChatGPT API Automation Started');
  console.log('=' .repeat(50));
  console.log(`🔄 Testing ${totalCodes} promo codes with ${concurrentRequests} concurrent requests`);
  console.log('=' .repeat(50));

  let successCount = 0;
  let eligibleCount = 0;
  let failureCount = 0;
  let testedCount = 0;
  const maxTestsBeforeFallback = 2500;
  const fallbackCode = 'RUGBMBTFVNCDY3PV';

  // Generate all promo codes
  const promoCodes = [];
  for (let i = 0; i < totalCodes; i++) {
    promoCodes.push(automation.generatePromoCode());
  }

  // Process codes in batches (multi-threading simulation)
  for (let i = 0; i < promoCodes.length; i += concurrentRequests) {
    const batch = promoCodes.slice(i, i + concurrentRequests);
    console.log(`\n📦 Processing batch ${Math.floor(i / concurrentRequests) + 1}/${Math.ceil(promoCodes.length / concurrentRequests)}`);

    // Execute batch requests in parallel
    const batchPromises = batch.map(code => automation.getPromotionMetadata(code));
    const results = await Promise.all(batchPromises);

    // Process results
    results.forEach(result => {
      testedCount++;
      if (result.success) {
        successCount++;

        if (automation.isEligible(result)) {
          eligibleCount++;
          console.log(`🎉 ELIGIBLE: ${result.promoCode}`);
          automation.saveEligibleCode(result.promoCode);
        }
      } else {
        failureCount++;
        console.log(`❌ [${result.promoCode}] Error: ${result.error}`);
      }
    });

    // Check if we've tested 5000 codes without finding any eligible
    if (testedCount >= maxTestsBeforeFallback && eligibleCount === 0) {
      console.log(`\n⚠️  Tested ${testedCount} codes without finding any ELIGIBLE`);
      console.log(`🔄 Trying fallback code: ${fallbackCode}`);

      const fallbackResult = await automation.getPromotionMetadata(fallbackCode);
      testedCount++;

      if (fallbackResult.success) {
        successCount++;
        if (automation.isEligible(fallbackResult)) {
          eligibleCount++;
          console.log(`🎉 ELIGIBLE (FALLBACK): ${fallbackCode}`);
          automation.saveEligibleCode(fallbackCode);
        } else {
          console.log(`❌ Fallback code not eligible: ${fallbackCode}`);
        }
      } else {
        failureCount++;
        console.log(`❌ Fallback code error: ${fallbackResult.error}`);
      }
    }

    // Add small delay between batches to avoid rate limiting
    if (i + concurrentRequests < promoCodes.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('📊 Final Statistics:');
  console.log(`✅ Successful requests: ${successCount}`);
  console.log(`🎉 Eligible codes found: ${eligibleCount}`);
  console.log(`❌ Failed requests: ${failureCount}`);
  console.log(`📝 Total codes tested: ${testedCount}`);
  console.log(`📁 Results saved to: ${automation.resultsFile}`);
  console.log('=' .repeat(50));
  console.log('🏁 Automation completed');

  process.exit(eligibleCount > 0 ? 0 : 1);
}

// Export for use as module
module.exports = ChatGPTAPIAutomation;

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

