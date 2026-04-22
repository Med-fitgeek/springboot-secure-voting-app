package com.evoting.evote_backend.service.interfaces;

import com.evoting.evote_backend.dto.UpdatePasswordDto;
import com.evoting.evote_backend.dto.UpdateUserDto;
import com.evoting.evote_backend.dto.UserDto;
import com.evoting.evote_backend.entity.User;

public interface CurrentUserService {

    User getCurrentUser();
    UserDto UpdateUser(UpdateUserDto userDto);
    void updatePassword(UpdatePasswordDto dto);
    void deleteAccount();
}