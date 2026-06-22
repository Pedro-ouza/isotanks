import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SharePointListService } from '../../services/SharePointListService';
import { DashboardIsotanks } from './components/DashboardIsotanks';
import { IDashboardIsotanksProps } from './components/IDashboardIsotanksProps';

export interface IDashboardIsotanksWebPartProps {
  siteUrl: string;
}

export default class DashboardIsotanksWebPart extends BaseClientSideWebPart<IDashboardIsotanksWebPartProps> {

  public onInit(): Promise<void> {
    SharePointListService.initialize(this.context);
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IDashboardIsotanksProps> = React.createElement(
      DashboardIsotanks,
      {
        context: this.context,
        siteUrl: this.properties.siteUrl || this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Configurações do Dashboard de Isotanks' },
          groups: [
            {
              groupName: 'Configuração',
              groupFields: [
                PropertyPaneTextField('siteUrl', {
                  label: 'URL do Site SharePoint (deixe em branco para usar o site atual)',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
