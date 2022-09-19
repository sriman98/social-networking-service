import React, { Component, Fragment } from 'react';
import classes from './Profile.css';
import { Avatar, Box, Card, Button, Typography, Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AddPost from '../../../shared/AddPost/AddPost';
import Posts from '../../../shared/Posts/Posts';
import axios from 'axios';
import environment from '../../../environment/environment';
import * as postActions from '../store/post/post.actions';
import * as authActions from '../../Auth/store/auth.actions';
import { connect } from 'react-redux';
import DialogUsers from '../../../shared/DialogUsers/DialogUsers';

class Profile extends Component {

    constructor (props) {
        super(props);
        this.state = {
            addPost: false,
            showUsers: false,
            type: '',
            anchorEl: null,
            dotsAnchorEl: null,
            editMode: false,
            name: '',
            inputFile: null,
            previewProfileImage: '',
            user: {
                _id: null,
                name: '',
                username: '',
                profileImageUrl: '',
                followers_count: 0,
                following_count: 0,
                privateAccount: false,
                followedByLoggedUser: false,
                requestedByLoggedUser: false
            }
        }
        this.fileInputRef = React.createRef();
        this.userUrl = environment.SERVER + '/users';
    }

    componentWillMount() {
        this.props.clearPosts();
        axios.get(this.userUrl + '/' + this.props.match.params.userId)
            .then(response => {
                this.setUserState(response.data.user);
                this.props.initializePosts(response.data.user.posts);
            });
    }

    componentDidMount() {
        console.log('Profile.js componentDidMount');
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState || this.props.match.params.userId !== nextProps.match.params.userId) {
            if (this.props.match.params.userId !== nextProps.match.params.userId) {
                this.props.clearPosts();
                axios.get(this.userUrl + '/' + nextProps.match.params.userId)
                    .then(response => {
                        this.setUserState(response.data.user);
                        this.props.initializePosts(response.data.user.posts);
                    });
            }
            return true;
        }
        return false;
    }

    setUserState = (user) => {
        this.setState(prevState => {
            return {
                user: {
                    ...prevState.user,
                    ...user
                }
            }
        });
    }

    followUnfollowHandler = (type) => {
        const data = {
            userId: this.props.match.params.userId
        }

        switch (type) {
            case 'follow':
                axios.post(this.userUrl + '/follow', data)
                .then(response => { 
                    if (this.state.user.privateAccount) {
                        this.setState({ user: { ...this.state.user, requestedByLoggedUser: true } })
                    } else {
                        this.setState(prevState => {
                            return {
                                user: {
                                    ...prevState.user,
                                    followers_count: prevState.user.followers_count + 1,
                                    followedByLoggedUser: true
                                }
                            }
                        });
                    }
                });
                break;
            case 'unfollow':
                axios.post(this.userUrl + '/unfollow', data)
                .then(response => { 
                    this.setState(prevState => {
                        return {
                            user: {
                                ...prevState.user,
                                followers_count: prevState.user.followers_count - 1,
                                followedByLoggedUser: false
                            }
                        }
                    });
                });
                break;
            case 'cancel_request':
                axios.post(this.userUrl + '/cancelrequest', data)
                .then(response => this.setState({ user: { ...this.state.user, requestedByLoggedUser: false } }));
                break;
            default:
                break;
        }
    }

    postButtonClickHandler = () => {
        this.setState({ ...this.state, addPost: true });
    }

    closeDialogHandler = () => {
        this.setState({ ...this.state, addPost: false });
    }

    closeUsersHandler = () => {
        this.setState({ ...this.state, showUsers: false, type: '' });
    }

    followClickHandler = (type) => {
        this.setState({ ...this.state, showUsers: true, type: type });
    }

    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }

    closeMenu = () => {
        this.setState({ anchorEl: null });
    }

    editModeHandler = () => {
        this.setState({ editMode: true, dotsAnchorEl: null, name: this.state.user.name, previewProfileImage: this.state.user.profileImageUrl ? environment.SERVER + '/' + this.state.user.profileImageUrl : '' });
    }

    fileInputHandler = (event) => {
        const [file] = event.target.files;
        if (file) {
            this.setState({ inputFile: file, anchorEl: null });
            const reader = new FileReader();
            reader.onload = e => {
                this.setState({ previewProfileImage: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    }

    nameInputHandler = (event) => {
        this.setState({ name: event.target.value });
    }

    deleteProfileImageHandler = () => {
        this.setState({ previewProfileImage: '', inputFile: null, anchorEl: null });
    }

    updateProfileHandler = () => {
        if (this.state.inputFile !== null) {
            let formData = new FormData();
            console.log(this.state.inputFile);
            formData.append('file', this.state.inputFile);
            axios.post(environment.SERVER + '/fileupload', formData)
            .then(response => this.updateUserHandler(response.data.imageUrl));
        } else {
            this.updateUserHandler('');
        }
    }

    updateUserHandler = (profileImageUrl) => {
        const data = {
            name: this.state.name
        }
        if (profileImageUrl) {
            data.profileImageUrl = profileImageUrl;
        } else if (this.state.user.profileImageUrl !== '' && this.state.previewProfileImage === '') {
            data.profileImageUrl = '';
        }
        axios.put(this.userUrl, data)
        .then(response => {
            this.setState({
                user: {
                    ...this.state.user,
                    name: response.data.user.name,
                    profileImageUrl: response.data.user.profileImageUrl
                },
                editMode: false
            });
            this.props.updateUser({ user: response.data.user });
            this.props.updateCreatedUser({ user: response.data.user });
        });
    }

    render() {
        console.log('Profile.js render');

        let editSaveIcon = null;

        if (this.props.auth._id === this.props.match.params.userId) {
            editSaveIcon = (
                <IconButton className={classes.Dots} aria-controls="dots-menu" onClick={(e) => this.setState({ dotsAnchorEl: e.currentTarget })}><MoreHorizIcon /></IconButton>
            );
        }

        let editProfileButton = (
            <Avatar alt={this.state.user.name} src={this.state.user.profileImageUrl ? environment.SERVER + '/' + this.state.user.profileImageUrl : ''} className={classes.ProfileImage} />
        );

        let nameInput = (
            <Typography><b>{this.state.user.name}</b></Typography>
        );

        if (this.state.editMode) {
            editSaveIcon = (
                <Box display='flex' flexDirection='row' className={classes.Dots}>
                    <IconButton onClick={() => this.setState({ editMode: false })}><CancelIcon className={classes.ColorRed} /></IconButton>
                    <IconButton disabled={!this.state.name} color='primary' onClick={this.updateProfileHandler}><SaveIcon /></IconButton>
                </Box>
            );
            nameInput = (
                <input type='text' value={this.state.name} onChange={this.nameInputHandler} className={classes.Input} />
            );
            editProfileButton = (
                <Fragment>
                    <Badge overlap="circle" anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}} badgeContent={<IconButton aria-controls="simple-menu" onClick={this.openMenu}><EditIcon fontSize='small' className={classes.EditIcon} /></IconButton>}>
                        <Avatar alt={this.state.user.name} src={this.state.previewProfileImage} className={classes.ProfileImage} />
                    </Badge>
                    <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.closeMenu}>
                        <MenuItem onClick={() => this.fileInputRef.current.click()}>Upload</MenuItem>
                        {this.state.previewProfileImage ? <MenuItem onClick={this.deleteProfileImageHandler}>Delete</MenuItem> : null}
                    </Menu>
                    <input type='file' ref={this.fileInputRef} id='myfile' name='myfile' hidden onChange={this.fileInputHandler} accept="image/*" />
                </Fragment>
            );
        }

        let addPostButton = null;

        if (this.props.auth._id === this.state.user._id) {
            addPostButton = (
                <Button className={classes.Button} variant='contained' startIcon={<AddIcon />} color='primary' onClick={this.postButtonClickHandler}>Post</Button>
            );
        } else if (this.state.user.followedByLoggedUser) {
            addPostButton = (
                <Button className={classes.Button} variant='outlined' color='primary' onClick={() => this.followUnfollowHandler('unfollow')}>Unfollow</Button>
            );
        } else if (this.state.user.requestedByLoggedUser) {
            addPostButton = (
                <Button className={classes.Button} variant='outlined' color='primary' onClick={() => this.followUnfollowHandler('cancel_request')}>Requested</Button>
            );
        } else {
            addPostButton = (
                <Button className={classes.Button} variant='contained' color='primary' onClick={() => this.followUnfollowHandler('follow')}>Follow</Button>
            );
        }

        let posts = null;

        if (this.props.auth._id !== this.state.user._id && this.state.user.privateAccount && !this.state.user.followedByLoggedUser) {
            posts = (
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <LockOutlinedIcon fontSize='large' />
                    <Typography>This Account is private</Typography>
                </Box>
            );
        } else {
            posts = (
                <Posts />
            );
        }

        return (
            <div className={classes.Root}>
                <div className={classes.Sticky}>
                    <Card className={classes.Card}>
                        <Box display='flex' flexDirection='row' alignItems='center'>
                            {editProfileButton}
                            <Box display='flex' flexDirection='column' marginLeft='100px'>
                                <Box display='flex' flexDirection='row' marginBottom='10px'>
                                    <Box marginRight='40px'>
                                        <Typography>Name:</Typography>
                                    </Box>
                                    {nameInput}
                                </Box>
                                <Box display='flex' flexDirection='row'>
                                    <Box marginRight='10px'>
                                        <Typography>Username:</Typography>
                                    </Box>
                                    <Typography><b>{this.state.user.username}</b></Typography>
                                </Box>
                            </Box>
                            <Box display='flex' flexDirection='column' marginLeft='150px' alignItems='center' className={classes.CursorPointer} onClick={() => this.followClickHandler('followers')}>
                                <div className={classes.Count}>{this.state.user.followers_count}</div>
                                <div>Followers</div>
                            </Box>
                            <Box display='flex' flexDirection='column' marginLeft='150px' alignItems='center' className={classes.CursorPointer} onClick={() => this.followClickHandler('following')}>
                                <div className={classes.Count}>{this.state.user.following_count}</div>
                                <div>Following</div>
                            </Box>
                            {editSaveIcon}
                            <Menu id="dots-menu" anchorEl={this.state.dotsAnchorEl} open={Boolean(this.state.dotsAnchorEl)} onClose={() => this.setState({ dotsAnchorEl: null })}>
                                <MenuItem onClick={this.editModeHandler}>Edit</MenuItem>
                            </Menu>
                        </Box>
                    </Card>
                    <Box className={classes.ButtonDiv} marginTop='20px' display='flex' alignItems='end'>
                        {addPostButton}
                    </Box>
                </div>
                <div className={classes.Posts}>
                    {posts}
                </div>
                {this.state.addPost ? <AddPost closeDialog={this.closeDialogHandler} /> : null}
                {this.state.showUsers ? <DialogUsers type={this.state.type} id={this.state.user._id} closeDialog={this.closeUsersHandler} /> : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initializePosts: (payload) => dispatch(postActions.initializePosts(payload)),
        clearPosts: () => dispatch(postActions.clearPosts()),
        updateUser: (payload) => dispatch(authActions.updateUser(payload)),
        updateCreatedUser: (payload) => dispatch(postActions.updateCreatedUser(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
