import React, { startTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBarScroll from 'components/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useTheme } from 'components/ThemeProvider';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useClearAllNotifications } from 'hooks';

// assets
import Img1 from 'assets/images/user/avatar-1.png';
import Img2 from 'assets/images/user/avatar-2.png';

// Placeholder userId - replace with actual user ID from auth context
const userId = '654d40ada5a91c7abc84c550';

// =============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const navigate = useNavigate();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const { theme, toggleTheme } = useTheme();

  const { data: notificationsData, isLoading } = useNotifications(userId);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const clearAllMutation = useClearAllNotifications();

  const notifications = notificationsData || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Transform API data to UI format
  const transformedNotifications = notifications.map(notification => ({
    id: notification._id,
    title: notification.title,
    description: notification.message,
    date: new Date(notification.createdAt).toLocaleDateString(),
    time: new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: Img1, // Default avatar, can be customized based on type
    isRead: notification.isRead,
    route: notification.metadata?.route,
    actions: false // No actions in current API
  }));

  const handleMarkAsRead = (notificationId: string, route?: string) => {
    console.log(notificationId, route, `notificationId`);

    markAsReadMutation.mutate(notificationId, {
      onSuccess: () => {
        if (route) {
          navigate(route);
        }
      }
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(userId);
  };

  const handleClearAllNotifications = () => {
    clearAllMutation.mutate(userId);
  };

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={() => {
                  handlerDrawerOpen(!drawerOpen);
                }}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle variant="link" className="pc-head-link arrow-none m-0 trig-drp-search" id="dropdown-search">
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control type="search" placeholder="Search here. . ." className="border-0 shadow-none" />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link"
                onClick={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <i className={`ph ${theme === 'light' ? 'ph-moon' : 'ph-sun'}`} />
              </Nav.Link>
            </Nav.Item>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link" id="notification-dropdown">
                <i className="ph ph-bell" />
                {unreadCount > 0 && <span className="badge bg-success pc-h-badge">{unreadCount}</span>}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-notification pc-h-dropdown">
                <Dropdown.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="m-0">Notifications</h5>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                  >
                    {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all read'}
                  </Button>
                </Dropdown.Header>
                <SimpleBarScroll style={{ maxHeight: 'calc(100vh - 215px)' }}>
                  <div className="dropdown-body text-wrap position-relative">
                    {isLoading ? (
                      <div className="text-center py-3">
                        <i className="ph ph-spinner ph-spin"></i> Loading...
                      </div>
                    ) : transformedNotifications.length === 0 ? (
                      <div className="text-center py-3 text-muted">
                        No notifications
                      </div>
                    ) : (
                      transformedNotifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                          {index === 0 || transformedNotifications[index - 1].date !== notification.date ? (
                            <p className="text-span">{notification.date}</p>
                          ) : null}
                          <div
                            className={`cursor-pointer ${!notification.isRead ? 'bg-light' : ''}`}
                            onClick={() => handleMarkAsRead(notification.id, notification.route)}
                          >
                            <MainCard className="mb-0 border-0">
                              <Stack direction="horizontal" gap={3}>
                                {/* <Image className="img-radius avatar rounded-0" src={notification.avatar} alt="Generic placeholder image" /> */}
                                <div className="flex-grow-1">
                                  <span className="float-end text-sm text-muted">{notification.time}</span>
                                  <h5 className="text-body mb-2">{notification.title}</h5>
                                  <p className="mb-0">{notification.description}</p>
                                  {!notification.isRead && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 mt-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification.id, notification.route);
                                      }}
                                      disabled={markAsReadMutation.isPending}
                                    >
                                      Mark as read
                                    </Button>
                                  )}
                                </div>
                              </Stack>
                            </MainCard>
                          </div>
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </SimpleBarScroll>

                <div className="text-center py-2">
                  <Button
                    variant="link"
                    className="link-danger p-0"
                    onClick={handleClearAllNotifications}
                    disabled={clearAllMutation.isPending || notifications.length === 0}
                  >
                    {clearAllMutation.isPending ? 'Clearing...' : 'Clear all Notifications'}
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="pc-head-link arrow-none me-0"
                variant="link"
                id="user-profile-dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="ph ph-user-circle" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      <Image src={Img2} alt="user-avatar" className="user-avatar wid-35" roundedCircle />
                    </div>
                    <Stack gap={1}>
                      <h6 className="text-white mb-0">Carson Darrin 🖖</h6>
                      <span className="text-white text-opacity-75">carson.darrin@company.io</span>
                    </Stack>
                  </Stack>
                </Dropdown.Header>

                <div className="dropdown-body">
                  <div className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-gear me-2" />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-share-network me-2" />
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-lock-key me-2" />
                      Change Password
                    </Dropdown.Item>
                    <div className="d-grid my-2">
                      <Button>
                        <i className="ph ph-sign-out align-middle me-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </header>
  );
}
