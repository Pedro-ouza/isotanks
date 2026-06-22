import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SharePointListService } from '../../services/SharePointListService';
import { IsotankAllocationPane } from '../../components/IsotankAllocationPane';

export default class AllocationIsotanksWebPart extends BaseClientSideWebPart<{}> {

  public onInit(): Promise<void> {
    SharePointListService.initialize(this.context);
    return super.onInit();
  }

  public render(): void {
    const element = React.createElement(IsotankAllocationPane, {
      context: this.context,
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] };
  }
}
