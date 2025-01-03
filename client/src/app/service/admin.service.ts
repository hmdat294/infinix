import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  getUserId(id: number = 0): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user/${id > 0 ? id : ''}`, { headers });
  }
  getPost(id: number = 0): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/post/${id > 0 ? id : ''}`, { headers });
  }

  getConversationsGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/conversations-growth`, { headers });
  }
  getReports(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/report`, { headers });
  }



  getConversationsGrowth(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/conversations-growth`, { headers });
  }

  getTotalReports(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-reports`, { headers });
  }

  getTotalPosts(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-posts`, { headers });
  }

  getTotalPostBookmarks(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-bookmarks`, { headers });
  }

  getTotalPostComments(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-comments`, { headers });
  }

  getTotalPostLikes(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-likes`, { headers });
  }

  getTotalPostShares(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-shares`, { headers });
  }
  getTotalUser(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-users`, { headers });
  }
  getTotalPost(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-posts`, { headers });
  }
  getTotalReport(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-reports`, { headers });
  }
  getTotalConversations(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-conversations`, { headers });
  }
  getUserGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/users-growth`, { headers });
  }
  getPostGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/posts-growth`, { headers });
  }

  getTotalUsers(): Observable<{ data: number }> {
    return this.http.get<{ data: number }>('api_endpoint_here');
  }
  updateReportStatus(id: number, status: string): Observable<any> {
    const headers = this.authService.getToken();  
    return this.http.post(`${this.apiUrl}/report/${id}`, { 'status':status }, { headers });
 }


getShop(): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/shop`, { headers });
}
getRevenus(): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/statistics/revenue`, { headers });
}

getShopRevenusById(id: number = 0): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/statistics/shop-revenue/${id > 0 ? id : ''}`, { headers });
}
getShopRevenus(): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/statistics/shop`, { headers });
}
getAllOrder(): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/all-order`, { headers });
}
getAllOrderById(id:number): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/shop/${id}/orders`, { headers });
}


postshop(id: number, is_active: string): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.post(`${this.apiUrl}/shop/${id}`,{is_active}, { headers });
}
getShopId(id: number, is_active: string): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.post(`${this.apiUrl}/shop/${id}`, { headers });
}

getListProductByShop(shop_id: number): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.get(`${this.apiUrl}/shop/${shop_id}/products`, { headers });
}


createOrUpdatePunishment( data: any): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.post(`${this.apiUrl}/punishment`, data, { headers });
}

  
  
  
}
