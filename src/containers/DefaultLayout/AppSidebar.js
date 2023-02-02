import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import navigation from '../../_nav'

const AppSidebar = ({ onToggle, visible }) => <CSidebar
            position="fixed"
            visible={visible}
            onVisibleChange={(changeVisible) => {
                onToggle(changeVisible);
            }}>
            <CSidebarBrand className="d-none d-md-flex">
                GoFundHer
            </CSidebarBrand>
            <CSidebarNav>
                {/* @ts-ignore */}
                <SimpleBar>
                    <AppSidebarNav items={navigation} />
                </SimpleBar>
            </CSidebarNav>
            <CSidebarToggler
                className="d-none d-lg-flex"
                onClick={() => onToggle(!visible)}
            />
        </CSidebar>

export default React.memo(AppSidebar)