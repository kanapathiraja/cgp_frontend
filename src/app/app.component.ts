import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { filter } from 'rxjs/internal/operators/filter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  langSelFlag = false;

  constructor(
    public translate: TranslateService,
    private router: Router
    ) {
      this.initLanguageSelection();
      this.langSelectionDropdownAlign();
  }

  initLanguageSelection(): void {
    this.translate.addLangs(['fr']);
    this.translate.setDefaultLang(environment.defaultLanguage);
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/fr/) ? browserLang : 'fr');
  }

  langSelectionDropdownAlign(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe((event: any) => {
      if (event.url === '/homepage' || event.url === '/auth/login') {
        this.langSelFlag = true;
      } else {
        this.langSelFlag = false;
      }
    });
  }
  onActivate() {
    window.scroll(0, 0);
  }
}
