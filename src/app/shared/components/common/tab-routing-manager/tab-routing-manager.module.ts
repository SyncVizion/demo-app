import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabRouteComponent } from './tab-route/tab-route.component';
import { TabRoutingManagerComponent } from './tab-routing-manager.component';

/**
 * Tab Routing Manager Module
 *
 * @author Sam Butler
 * @since August 18, 2022
 */
@NgModule({
  imports: [TabRoutingManagerComponent, TabRouteComponent, MatTabsModule],
  exports: [TabRoutingManagerComponent, TabRouteComponent, MatTabsModule],
})
export class TabRoutingManagerModule {}
